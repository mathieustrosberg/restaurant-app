import { NextRequest } from 'next/server'
import { MongoClient } from 'mongodb'
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'

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

    console.log('🔄 Connecting to MongoDB...')
    
    // Créer une connexion MongoDB directe
    const client = new MongoClient(process.env.MONGODB_URI || '')
    await client.connect()
    const db = client.db(process.env.MONGODB_DB || 'restaurant')
    
    console.log('✅ MongoDB connected')
    
    // Créer une instance Better Auth locale
    const auth = betterAuth({
      secret: process.env.BETTER_AUTH_SECRET || '',
      baseURL: process.env.BETTER_AUTH_URL || '',
      emailAndPassword: {
        enabled: true,
        autoSignIn: true
      },
      database: mongodbAdapter(db)
    })

    console.log('🔄 Creating admin user...')
    
    // Créer l'utilisateur admin
    const result = await auth.api.signUpEmail({
      body: {
        email: "admin@restaurant.com",
        password: "Admin123!",
        name: "Admin Restaurant"
      }
    })

    console.log('✅ Admin user created:', result)
    await client.close()

    return Response.json({ 
      success: true, 
      message: "Admin user created successfully",
      email: "admin@restaurant.com",
      result: result
    })
    
  } catch (error: any) {
    console.error('❌ Full error object:', error)
    
    if (error.message?.includes("User already exists") || 
        error.message?.includes("EMAIL_ALREADY_USED") ||
        error.message?.includes("email already exists")) {
      console.log('ℹ️ Admin user already exists')
      return Response.json({ 
        success: true, 
        message: "Admin user already exists",
        email: "admin@restaurant.com"
      })
    }
    
    return Response.json({ 
      error: 'Failed to create admin user',
      details: error.message,
      stack: error.stack,
      env_check: {
        has_mongodb_uri: !!process.env.MONGODB_URI,
        has_auth_secret: !!process.env.BETTER_AUTH_SECRET,
        has_auth_url: !!process.env.BETTER_AUTH_URL
      }
    }, { status: 500 })
  }
}
