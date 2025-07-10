import { NextRequest, NextResponse } from 'next/server'
import { getPageContent, updatePageContent, getDefaultContent } from '@/lib/content'

export async function GET() {
  try {
    let content = await getPageContent()
    
    // Si aucun contenu n'existe, initialiser avec le contenu par défaut
    if (!content) {
      const defaultContent = await getDefaultContent()
      const success = await updatePageContent(defaultContent)
      if (success) {
        content = await getPageContent()
      }
    }
    
    return NextResponse.json(content || await getDefaultContent())
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du contenu' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const success = await updatePageContent(body)
    
    if (success) {
      return NextResponse.json({ message: 'Contenu mis à jour avec succès' })
    } else {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du contenu' }, 
      { status: 500 }
    )
  }
} 