import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(subs);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email requis." }, { status: 400 });
    const sub = await prisma.newsletterSubscriber.create({ data: { email } });
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


