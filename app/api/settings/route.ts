import { NextResponse } from "next/server";
import { mongoConnect } from "@/lib/mongo/connect";
import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: String,
  updatedAt: { type: Date, default: Date.now }
});

const SettingsModel = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

export async function GET() {
  try {
    await mongoConnect();
    const settings = await SettingsModel.find({});
    
    // Convertir en objet pour faciliter l'utilisation
    const settingsObj: Record<string, string> = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await mongoConnect();
    const body = await req.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const updatedSetting = await SettingsModel.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json(updatedSetting);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
