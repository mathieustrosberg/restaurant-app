import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import des dépendances
const { betterAuth } = require('better-auth');
const { MongoClient } = require('mongodb');
const { mongodbAdapter } = require('better-auth/adapters/mongodb');

async function createAdmin() {
  try {
    // Configuration de Better Auth identique à lib/auth.ts
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'restaurant');

    const auth = betterAuth({
      secret: process.env.BETTER_AUTH_SECRET || 'temp-secret-key',
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      emailAndPassword: {
        enabled: true,
        autoSignIn: true
      },
      database: mongodbAdapter(db)
    });

    // Créer l'utilisateur admin
    const result = await auth.api.signUpEmail({
      body: {
        email: "admin@restaurant.com",
        password: "Admin123!",
        name: "Admin Restaurant"
      }
    });

    console.log("✅ Utilisateur admin créé avec succès :", result);
    await client.close();
  } catch (error) {
    if (error.message?.includes("User already exists") || error.message?.includes("EMAIL_ALREADY_USED")) {
      console.log("ℹ️  L'utilisateur admin existe déjà");
    } else {
      console.error("❌ Erreur lors de la création de l'admin :", error.message);
    }
  }
}

createAdmin();
