import { NextResponse } from "next/server";
import { mongoConnect } from "@/lib/mongo/connect";
import ContentPage from "@/lib/mongo/models/ContentPage";

export async function GET() {
  await mongoConnect();
  let doc = await ContentPage.findOne({ slug: "home" });
  if (!doc) {
    doc = await ContentPage.create({
      slug: "home",
      sections: [
        { type: "title", value: { text: "Mon Restaurant" } },
        { type: "paragraph", value: { text: "Bienvenue dans notre restaurant" } },
        { type: "image", value: { src: "/image.jpg", alt: "Façade du restaurant" } },
      ],
    });
  }
  return NextResponse.json(doc);
}

export async function PUT(req: Request) {
  await mongoConnect();
  const { sections, updatedBy } = await req.json();
  const doc = await ContentPage.findOneAndUpdate(
    { slug: "home" },
    { sections, updatedBy },
    { upsert: true, new: true }
  );
  return NextResponse.json(doc);
}


