import { NextResponse } from "next/server";
import { mongoConnect } from "@/lib/mongo/connect";
import mongoose from "mongoose";

// Schéma pour le menu
const MenuSchema = new mongoose.Schema({
  category: { type: String, required: true }, // "entrees", "plats", "desserts"
  items: [{ 
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: String, default: "" }
  }]
}, { timestamps: true });

const MenuModel = mongoose.models.Menu || mongoose.model("Menu", MenuSchema);

export async function GET() {
  try {
    await mongoConnect();
    const menuData = await MenuModel.find({}).sort({ category: 1 });
    
    // Initialiser avec des données par défaut si vide
    if (menuData.length === 0) {
      const defaultMenu = [
        {
          category: "entrees",
          items: [
            { name: "Salade verte", description: "Salade fraîche de saison", price: "8€" },
            { name: "Soupe à l'oignon", description: "Soupe traditionnelle française", price: "10€" }
          ]
        },
        {
          category: "plats",
          items: [
            { name: "Filet de bœuf", description: "Pièce de bœuf grillée", price: "28€" },
            { name: "Saumon grillé", description: "Filet de saumon aux herbes", price: "24€" }
          ]
        },
        {
          category: "desserts",
          items: [
            { name: "Tarte aux pommes", description: "Tarte maison aux pommes", price: "8€" },
            { name: "Mousse au chocolat", description: "Mousse onctueuse au chocolat noir", price: "9€" }
          ]
        }
      ];
      
      await MenuModel.insertMany(defaultMenu);
      return NextResponse.json(defaultMenu);
    }
    
    return NextResponse.json(menuData);
  } catch (error) {
    console.error("Erreur lors de la récupération du menu:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await mongoConnect();
    const { category, items } = await req.json();
    
    if (!category || !Array.isArray(items)) {
      return NextResponse.json({ error: "Catégorie et items requis" }, { status: 400 });
    }
    
    const updatedMenu = await MenuModel.findOneAndUpdate(
      { category },
      { category, items },
      { upsert: true, new: true }
    );
    
    return NextResponse.json(updatedMenu);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du menu:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
