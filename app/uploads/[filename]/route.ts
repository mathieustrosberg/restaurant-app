import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Sécurité : vérifier que le filename ne contient pas de caractères dangereux
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    
    try {
      const fileBuffer = await readFile(filePath);
      
      // Déterminer le type MIME basé sur l'extension
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream';
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.webp':
          contentType = 'image/webp';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
      }

      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (error) {
      return new NextResponse("File not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error serving upload:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
