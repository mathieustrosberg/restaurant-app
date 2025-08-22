import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotificationEmail } from "@/lib/email-service";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message, phone } = await req.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        phone: phone?.trim() || null,
      },
    });

    // Envoyer une notification email au restaurant
    try {
      await sendContactNotificationEmail({
        customerName: contact.name,
        customerEmail: contact.email,
        subject: contact.subject,
        message: contact.message,
        phone: contact.phone || undefined,
      });
      console.log(`Notification de contact envoyée pour : ${contact.email}`);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de la notification email:', emailError);
      // Ne pas faire échouer la création du contact si l'email échoue
    }

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
