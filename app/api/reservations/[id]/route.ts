import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";
import { sendReservationEmail } from "@/lib/email-service";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body as { status: ReservationStatus };

    if (!status || !["PENDING", "CONFIRMED", "CANCELED"].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: { customer: true },
    });

    // Envoyer l'email de confirmation/refus si le statut change vers CONFIRMED ou CANCELED
    if (status === "CONFIRMED" || status === "CANCELED") {
      try {
        await sendReservationEmail(status, {
          customerName: reservation.customer.name,
          customerEmail: reservation.customer.email,
          date: reservation.date.toISOString(),
          time: reservation.time,
          service: reservation.service,
          people: reservation.people,
          notes: reservation.notes || undefined,
        });
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
        // On continue même si l'email échoue
      }
    }

    return NextResponse.json({
      id: reservation.id,
      name: reservation.customer.name,
      email: reservation.customer.email,
      phone: reservation.customer.phone,
      date: reservation.date.toISOString(),
      time: reservation.time,
      service: reservation.service,
      people: reservation.people,
      notes: reservation.notes || undefined,
      status: reservation.status,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}