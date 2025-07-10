import { validateEnv, EnvConfig } from './schemas'

/**
 * Configuration de l'application avec validation des variables d'environnement
 * 
 * Ce module centralise toute la configuration de l'application et valide
 * que toutes les variables d'environnement requises sont présentes et valides.
 */

let config: EnvConfig | null = null

/**
 * Valide et retourne la configuration de l'application
 * Utilise la validation Zod pour s'assurer que toutes les variables sont valides
 * 
 * @returns Configuration validée de l'application
 * @throws Process.exit(1) si la configuration est invalide
 */
export function getConfig(): EnvConfig {
  if (!config) {
    console.log('🔧 Validation de la configuration d\'environnement...')
    config = validateEnv()
    console.log('✅ Configuration validée avec succès')
  }
  return config
}

/**
 * Configuration MongoDB avec URL et nom de base validés
 */
export const mongoConfig = {
  get uri() {
    return getConfig().MONGODB_URI
  },
  get database() {
    return getConfig().MONGODB_DB
  },
  // Options de connexion recommandées pour la production
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // IPv4
    retryWrites: true,
    writeConcern: {
      w: 'majority'
    }
  }
}

/**
 * Configuration d'authentification Better Auth
 */
export const authConfig = {
  get secret() {
    return getConfig().BETTER_AUTH_SECRET
  },
  get baseURL() {
    return getConfig().BETTER_AUTH_URL
  },
  get adminEmail() {
    return getConfig().ADMIN_EMAIL || 'admin@loon-garden.com'
  },
  get adminPassword() {
    return getConfig().ADMIN_PASSWORD
  }
}

/**
 * Configuration de l'environnement (development, production, test)
 */
export const envConfig = {
  get isDevelopment() {
    return process.env.NODE_ENV === 'development'
  },
  get isProduction() {
    return process.env.NODE_ENV === 'production'
  },
  get isTest() {
    return process.env.NODE_ENV === 'test'
  },
  get nodeEnv() {
    return process.env.NODE_ENV || 'development'
  }
}

/**
 * Configuration de logging selon l'environnement
 */
export const logConfig = {
  get level() {
    if (envConfig.isProduction) return 'error'
    if (envConfig.isTest) return 'silent'
    return 'debug'
  },
  get enableConsole() {
    return !envConfig.isTest
  },
  get enableFileLogging() {
    return envConfig.isProduction
  }
}

/**
 * Configuration de sécurité
 */
export const securityConfig = {
  // CORS origins autorisés
  get allowedOrigins() {
    if (envConfig.isProduction) {
      return [
        'https://your-domain.com',
        'https://www.your-domain.com'
      ]
    }
    return ['http://localhost:3000', 'http://127.0.0.1:3000']
  },
  // Headers de sécurité
  get securityHeaders() {
    return {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      ...(envConfig.isProduction && {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
      })
    }
  },
  // Rate limiting
  get rateLimiting() {
    return {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: envConfig.isProduction ? 100 : 1000, // Limite par IP
      message: 'Trop de requêtes, veuillez réessayer plus tard.',
      standardHeaders: true,
      legacyHeaders: false
    }
  }
}

/**
 * Configuration des features selon l'environnement
 */
export const featureConfig = {
  get enableDebugLogs() {
    return envConfig.isDevelopment
  },
  get enableHotReload() {
    return envConfig.isDevelopment
  },
  get enableServiceWorker() {
    return envConfig.isProduction
  },
  get enableAnalytics() {
    return envConfig.isProduction
  }
}

/**
 * Validation de la configuration au démarrage
 * À appeler au début de l'application
 */
export function validateConfiguration() {
  try {
    const config = getConfig()
    
    // Validation supplémentaire spécifique au métier
    if (envConfig.isProduction) {
      if (!config.BETTER_AUTH_SECRET || config.BETTER_AUTH_SECRET.length < 32) {
        throw new Error('BETTER_AUTH_SECRET doit être plus sécurisé en production (32+ caractères)')
      }
      
      if (config.BETTER_AUTH_URL.includes('localhost') || config.BETTER_AUTH_URL.includes('127.0.0.1')) {
        throw new Error('BETTER_AUTH_URL ne peut pas être localhost en production')
      }
    }
    
    console.log('✅ Configuration de l\'application validée')
    console.log(`📊 Environnement: ${envConfig.nodeEnv}`)
    console.log(`🗄️  Base de données: ${mongoConfig.database}`)
    console.log(`🔐 Auth URL: ${authConfig.baseURL}`)
    
    return true
  } catch (error) {
    console.error('❌ Erreur de configuration:', error)
    return false
  }
}

// Export par défaut pour faciliter l'import
export default {
  mongo: mongoConfig,
  auth: authConfig,
  env: envConfig,
  log: logConfig,
  security: securityConfig,
  features: featureConfig,
  validate: validateConfiguration
} 