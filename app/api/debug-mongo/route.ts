import { NextRequest } from 'next/server'
import { MongoClient } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body
    
    if (secret !== process.env.BETTER_AUTH_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Testing MongoDB connection...')
    console.log('MongoDB URI format:', process.env.MONGODB_URI?.substring(0, 30) + '...')
    
    const client = new MongoClient(process.env.MONGODB_URI || '', {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      connectTimeoutMS: 10000,
      maxPoolSize: 1
    })
    
    console.log('🔄 Attempting connection...')
    await client.connect()
    
    console.log('✅ MongoDB connected successfully')
    
    // Test ping
    await client.db("admin").command({ ping: 1 })
    console.log('✅ MongoDB ping successful')
    
    const db = client.db(process.env.MONGODB_DB || 'restaurant')
    
    // Tester l'accès aux collections
    const collections = await db.listCollections().toArray()
    console.log('Collections:', collections.map(c => c.name))
    
    // Vérifier si l'admin existe déjà
    const existingUser = await db.collection('user').findOne({ email: 'admin@restaurant.com' })
    console.log('Existing admin user:', !!existingUser)
    
    // Compter les utilisateurs
    const userCount = await db.collection('user').countDocuments()
    console.log('Total users:', userCount)
    
    await client.close()
    
    return Response.json({
      success: true,
      mongodb_connection: 'OK',
      collections: collections.map(c => c.name),
      existing_admin: !!existingUser,
      total_users: userCount,
      env: {
        mongodb_uri_prefix: process.env.MONGODB_URI?.substring(0, 20),
        mongodb_db: process.env.MONGODB_DB
      }
    })
    
  } catch (error: any) {
    console.error('MongoDB test error:', error)
    return Response.json({ 
      error: 'MongoDB test failed',
      details: error.message,
      code: error.code
    }, { status: 500 })
  }
}
