import { NextRequest } from 'next/server'
import { MongoClient } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body
    
    if (secret !== process.env.BETTER_AUTH_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Connecting to MongoDB...')
    
    const client = new MongoClient(process.env.MONGODB_URI || '')
    await client.connect()
    const db = client.db(process.env.MONGODB_DB || 'restaurant')
    
    console.log('✅ MongoDB connected')
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.collection('user').findOne({ email: 'admin@restaurant.com' })
    
    if (existingUser) {
      console.log('ℹ️ Admin user already exists')
      await client.close()
      return Response.json({ 
        success: true, 
        message: "Admin user already exists",
        email: "admin@restaurant.com",
        userId: existingUser.id
      })
    }

    console.log('🔄 Creating admin user with Better Auth format...')
    
    // Importer bcrypt dynamiquement pour hasher le mot de passe
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash('Admin123!', 10)
    
    // Générer des IDs uniques
    const userId = crypto.randomUUID()
    const accountId = crypto.randomUUID()
    
    // Format Better Auth pour l'utilisateur
    const user = {
      id: userId,
      email: 'admin@restaurant.com',
      name: 'Admin Restaurant',
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Format Better Auth pour le compte (credentials)
    const account = {
      id: accountId,
      accountId: 'admin@restaurant.com', // L'email sert d'accountId pour email/password
      providerId: 'credential',
      userId: userId,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insérer dans les collections Better Auth
    await db.collection('user').insertOne(user)
    await db.collection('account').insertOne(account)

    console.log('✅ Admin user created successfully')
    await client.close()

    return Response.json({ 
      success: true, 
      message: "Admin user created successfully with direct MongoDB approach",
      email: "admin@restaurant.com",
      userId: userId,
      method: "direct-mongodb"
    })
    
  } catch (error: any) {
    console.error('❌ Error:', error)
    
    return Response.json({ 
      error: 'Failed to create admin user',
      details: error.message,
      method: "direct-mongodb"
    }, { status: 500 })
  }
}
