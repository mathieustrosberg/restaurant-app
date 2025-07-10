import { NextRequest, NextResponse } from 'next/server'
import { getPageContent, updatePageContent, getDefaultContent } from '@/lib/content'
import { 
  validatePageContent, 
  sanitizePageContent, 
  PageContent as ValidatedPageContent
} from '@/lib/schemas'

/**
 * GET /api/content
 * Récupère le contenu de la page avec fallback vers le contenu par défaut
 */
export async function GET() {
  try {
    let content = await getPageContent()
    
    // Si aucun contenu n'existe, initialiser avec le contenu par défaut
    if (!content) {
      console.log('📝 Aucun contenu trouvé, initialisation avec le contenu par défaut')
      const defaultContent = await getDefaultContent()
      const success = await updatePageContent(defaultContent)
      if (success) {
        content = await getPageContent()
        console.log('✅ Contenu par défaut initialisé avec succès')
      } else {
        console.error('❌ Échec de l\'initialisation du contenu par défaut')
      }
    }
    
    // Valider le contenu avant de le retourner
    const finalContent = content || await getDefaultContent()
    const validation = validatePageContent(finalContent)
    
    if (!validation.success) {
      console.error('❌ Contenu invalide en base:', validation.errors)
      // Retourner le contenu par défaut si la validation échoue
      const defaultContent = await getDefaultContent()
      return NextResponse.json(defaultContent)
    }
    
    return NextResponse.json(finalContent)
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du contenu:', error)
    
    // En cas d'erreur, retourner le contenu par défaut
    try {
      const defaultContent = await getDefaultContent()
      return NextResponse.json(defaultContent)
    } catch (fallbackError) {
      console.error('❌ Impossible de récupérer le contenu par défaut:', fallbackError)
      return NextResponse.json(
        { 
          error: 'Service temporairement indisponible',
          code: 'CONTENT_SERVICE_ERROR'
        }, 
        { status: 503 }
      )
    }
  }
}

/**
 * PUT /api/content
 * Met à jour le contenu avec validation et sanitization
 */
export async function PUT(request: NextRequest) {
  try {
    // Vérifier le Content-Type
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { 
          error: 'Content-Type doit être application/json',
          code: 'INVALID_CONTENT_TYPE'
        }, 
        { status: 400 }
      )
    }

    // Parser le body JSON
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('❌ Erreur de parsing JSON:', parseError)
      return NextResponse.json(
        { 
          error: 'Format JSON invalide',
          code: 'INVALID_JSON'
        }, 
        { status: 400 }
      )
    }

    // Valider les données avec Zod
    const validation = validatePageContent(body)
    
    if (!validation.success) {
      console.warn('⚠️ Données invalides reçues:', validation.errors)
      return NextResponse.json(
        { 
          error: 'Données invalides',
          code: 'VALIDATION_ERROR',
          details: validation.errors
        }, 
        { status: 400 }
      )
    }

    // Sanitize les données pour la sécurité
    const sanitizedData = sanitizePageContent(validation.data!)
    console.log('🧹 Données sanitisées avec succès')

    // Mettre à jour en base (sanitizedData est garanti valide par la validation Zod)
    const success = await updatePageContent(sanitizedData)
    
    if (success) {
      console.log('✅ Contenu mis à jour avec succès')
      return NextResponse.json({ 
        message: 'Contenu mis à jour avec succès',
        success: true 
      })
    } else {
      console.error('❌ Échec de la mise à jour en base')
      return NextResponse.json(
        { 
          error: 'Erreur lors de la sauvegarde',
          code: 'DATABASE_ERROR'
        }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du contenu:', error)
    
    // Log détaillé pour le debugging
    if (error instanceof Error) {
      console.error('  - Message:', error.message)
      console.error('  - Stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        code: 'INTERNAL_SERVER_ERROR'
      }, 
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/content
 * Support CORS pour les requêtes préflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com' 
        : '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 