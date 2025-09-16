import { NextRequest } from 'next/server'
import { getAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Sécurité simple - vérifier un token secret
    const { secret } = await request.json()
    
    if (secret !== process.env.BETTER_AUTH_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const auth = getAuth()
    
    // Créer l'utilisateur admin
    const result = await auth.api.signUpEmail({
      body: {
        email: "admin@restaurant.com",
        password: "Admin123!",
        name: "Admin Restaurant"
      }
    })

    return Response.json({ 
      success: true, 
      message: "Admin user created successfully",
      email: "admin@restaurant.com"
    })
    
  } catch (error: any) {
    if (error.message?.includes("User already exists") || error.message?.includes("EMAIL_ALREADY_USED")) {
      return Response.json({ 
        success: true, 
        message: "Admin user already exists",
        email: "admin@restaurant.com"
      })
    }
    
    console.error('Error creating admin:', error)
    return Response.json({ 
      error: 'Failed to create admin user',
      details: error.message 
    }, { status: 500 })
  }
}
