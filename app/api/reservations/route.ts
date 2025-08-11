import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Service } from "@prisma/client";

export async function GET() {
  const data = await prisma.reservation.findMany({
    include: { customer: true },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });
  // Adapter pour le dashboard: aplatir quelques champs pratiques
  const formatted = data.map((r) => ({
    id: r.id,
    name: r.customer.name,
    email: r.customer.email,
    phone: r.customer.phone,
    date: r.date.toISOString(),
    time: r.time,
    service: r.service,
    people: r.people,
    notes: r.notes || undefined,
    status: r.status,
  }));
  return NextResponse.json(formatted);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, service, people, notes } = body as {
      name: string; email: string; phone: string;
      date: string; time: string; service: Service; people: number; notes?: string;
    };

    if (!name || !email || !phone || !date || !time || !service || !people) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    const customer = await prisma.customer.upsert({
      where: { email },
      update: { name, phone },
      create: { name, email, phone },
    });

    const resv = await prisma.reservation.create({
      data: {
        customerId: customer.id,
        date: new Date(date),
        time,
        service,
        people,
        notes: notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(resv, { status: 201 });
  } catch (error: unknown) {
    type WithCode = { code?: string };
    const err = error as WithCode;
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Créneau déjà réservé." }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}


