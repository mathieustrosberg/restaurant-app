import { NextRequest } from 'next/server'
import { getAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting admin creation process...')
    
    // Sécurité simple - vérifier un token secret
    const body = await request.json()
    const { secret } = body
    
    console.log('🔐 Checking secret...')
    if (secret !== process.env.BETTER_AUTH_SECRET) {
      console.log('❌ Invalid secret')
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Getting Better Auth instance...')
    const auth = getAuth()
    
    console.log('🔄 Environment variables check...')
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)
    console.log('BETTER_AUTH_SECRET exists:', !!process.env.BETTER_AUTH_SECRET)
    console.log('BETTER_AUTH_URL:', process.env.BETTER_AUTH_URL)

    console.log('🔄 Attempting to create admin user...')
    
    // Essayer d'abord de vérifier si l'utilisateur existe
    try {
      const existingUser = await auth.api.listUsers({})
      console.log('Existing users check completed')
    } catch (listError: any) {
      console.log('List users error (might be normal):', listError.message)
    }

    // Utiliser l'API interne de Better Auth pour créer l'utilisateur
    const result = await auth.api.signUpEmail({
      body: {
        email: "admin@restaurant.com",
        password: "Admin123!",
        name: "Admin Restaurant"
      },
      // Ajouter les headers nécessaires
      headers: {
        'content-type': 'application/json'
      }
    })

    console.log('✅ Admin user created successfully:', result)

    return Response.json({ 
      success: true, 
      message: "Admin user created successfully",
      email: "admin@restaurant.com",
      result: result
    })
    
  } catch (error: any) {
    console.error('❌ Full error object:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error cause:', error.cause)
    
    // Vérifier les erreurs spécifiques de Better Auth
    if (error.message?.includes("User already exists") || 
        error.message?.includes("EMAIL_ALREADY_USED") ||
        error.message?.includes("email already exists") ||
        error.status === 400) {
      console.log('ℹ️ Admin user likely already exists')
      return Response.json({ 
        success: true, 
        message: "Admin user already exists",
        email: "admin@restaurant.com"
      })
    }
    
    return Response.json({ 
      error: 'Failed to create admin user',
      details: error.message,
      errorName: error.name,
      status: error.status,
      env_check: {
        has_mongodb_uri: !!process.env.MONGODB_URI,
        has_auth_secret: !!process.env.BETTER_AUTH_SECRET,
        has_auth_url: !!process.env.BETTER_AUTH_URL,
        better_auth_url: process.env.BETTER_AUTH_URL
      }
    }, { status: 500 })
  }
}
