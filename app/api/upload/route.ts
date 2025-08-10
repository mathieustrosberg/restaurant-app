import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier trouvé" }, { status: 400 });
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Type de fichier non autorisé. Utilisez JPG, PNG ou WebP" 
      }, { status: 400 });
    }

    // Limiter la taille du fichier (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "Le fichier est trop volumineux. Maximum 5MB" 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer un nom de fichier unique avec timestamp
    const timestamp = Date.now();
    const extension = path.extname(file.name) || '.jpg';
    const filename = `image-${timestamp}${extension}`;

    // S'assurer que le dossier public/uploads existe
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }

    // Sauvegarder le fichier
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      message: "Fichier uploadé avec succès",
      filename: filename,
      url: `/uploads/${filename}`
    });

  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json({ 
      error: "Erreur lors de l'upload du fichier" 
    }, { status: 500 });
  }
}
