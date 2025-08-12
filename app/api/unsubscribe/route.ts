import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendUnsubscribeConfirmationEmail } from "@/lib/email-service";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: "Token requis." }, { status: 400 });
    }

    // Trouver et supprimer l'abonnement
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token }
    });

    if (!subscriber) {
      return NextResponse.json({ error: "Token invalide ou expiré." }, { status: 404 });
    }

    // Supprimer l'abonnement
    await prisma.newsletterSubscriber.delete({
      where: { id: subscriber.id }
    });

    // Envoyer l'email de confirmation de désabonnement
    try {
      await sendUnsubscribeConfirmationEmail(subscriber.email);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email de confirmation:", emailError);
      // On continue même si l'email échoue
    }

    return NextResponse.json({ 
      message: "Désabonnement réussi.",
      email: subscriber.email
    });

  } catch (error) {
    console.error("Erreur lors du désabonnement:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

// Méthode GET pour vérifier si un token est valide
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    
    if (!token) {
      return NextResponse.json({ error: "Token requis." }, { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
      select: { email: true }
    });

    if (!subscriber) {
      return NextResponse.json({ error: "Token invalide ou expiré." }, { status: 404 });
    }

    return NextResponse.json({ 
      valid: true,
      email: subscriber.email
    });

  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
