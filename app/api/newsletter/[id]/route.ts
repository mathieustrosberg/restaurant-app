import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const id = Number(segments[segments.length - 1]);
  await prisma.newsletterSubscriber.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


