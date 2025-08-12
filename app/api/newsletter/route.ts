import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterWelcomeEmail, generateUnsubscribeToken } from "@/lib/email-service";

export async function GET() {
  const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(subs);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email requis." }, { status: 400 });
    
    const unsubscribeToken = generateUnsubscribeToken();
    
    const sub = await prisma.newsletterSubscriber.create({ 
      data: { 
        email,
        unsubscribeToken 
      } 
    });

    // Envoyer l'email de bienvenue
    try {
      await sendNewsletterWelcomeEmail(email, unsubscribeToken);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email de bienvenue:", emailError);
      // On continue même si l'email échoue
    }
    
    return NextResponse.json(sub, { status: 201 });
  } catch (error: unknown) {
    type WithCode = { code?: string };
    const err = error as WithCode;
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Email déjà inscrit." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}


