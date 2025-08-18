import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

// Initialisation différée de MongoDB pour éviter les erreurs de build
let authInstance: any = null

export function getAuth() {
  if (authInstance) return authInstance

  // Créer l'instance auth seulement quand nécessaire
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/dummy')
    
    // En mode build, ne pas tenter de connexion
    if (process.env.NODE_ENV !== 'production' || process.env.MONGODB_URI) {
      client.connect().catch(() => {
        console.warn('MongoDB connection failed, but continuing...')
      })
    }
    
    const db = client.db(process.env.MONGODB_DB || 'restaurant')
    
    authInstance = betterAuth({
      secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret',
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001"
      ],
      emailAndPassword: {
        enabled: true,
        autoSignIn: true
      },
      database: mongodbAdapter(db)
    })
    
    return authInstance
  } catch (error) {
    console.error('Error creating auth instance:', error)
    // Retourner une instance fallback pour le build
    return betterAuth({
      secret: 'fallback-secret',
      baseURL: 'http://localhost:3000',
      emailAndPassword: {
        enabled: true,
        autoSignIn: true
      }
    })
  }
}

// Export pour compatibilité
export const auth = getAuth()
