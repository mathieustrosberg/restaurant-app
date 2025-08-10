import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split("/");
    const contactId = Number(segments[segments.length - 1]);

    if (isNaN(contactId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await request.json();
    const { status, response } = body;

    // Validation des statuts autorisés
    const validStatuses = ["NEW", "READ", "REPLIED"] as const;
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    type Status = (typeof validStatuses)[number];
    const updateData: { status?: Status; response?: string } = {};
    if (status) updateData.status = status as Status;
    if (response !== undefined) updateData.response = response;

    const contact = await prisma.contact.update({
      where: { id: contactId },
      data: updateData,
    });

    return NextResponse.json(contact);
  } catch (error: unknown) {
    console.error("Error updating contact:", error);
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Message non trouvé" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split("/");
    const contactId = Number(segments[segments.length - 1]);

    if (isNaN(contactId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.contact.delete({
      where: { id: contactId },
    });

    return NextResponse.json({ message: "Message supprimé avec succès" });
  } catch (error: unknown) {
    console.error("Error deleting contact:", error);
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Message non trouvé" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}