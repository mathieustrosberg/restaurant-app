import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import des dépendances
const { betterAuth } = require('better-auth');
const { MongoClient } = require('mongodb');
const { mongodbAdapter } = require('better-auth/adapters/mongodb');

async function createProductionAdmin() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    
    // Configuration pour la production
    const MONGODB_URI = "mongodb+srv://helloamthieu_db_user:Q2Fc01BUIpPUyOzt@cluster0.010bmuj.mongodb.net/restaurant?retryWrites=true&w=majority&tls=true";
    const BETTER_AUTH_SECRET = "auvsMVFfHYvxuHWF6ookRdX7JdJ68DNh";
    const BETTER_AUTH_URL = "https://restaurant-app-peach-nine.vercel.app";
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connecté à MongoDB Atlas');
    
    const db = client.db('restaurant');

    const auth = betterAuth({
      secret: BETTER_AUTH_SECRET,
      baseURL: BETTER_AUTH_URL,
      emailAndPassword: {
        enabled: true,
        autoSignIn: true
      },
      database: mongodbAdapter(db)
    });

    console.log('🔄 Création de l\'utilisateur admin...');
    
    // Créer l'utilisateur admin
    const result = await auth.api.signUpEmail({
      body: {
        email: "admin@restaurant.com",
        password: "Admin123!",
        name: "Admin Restaurant"
      }
    });

    console.log("✅ Utilisateur admin créé avec succès pour la production !");
    console.log("📧 Email: admin@restaurant.com");
    console.log("🔑 Mot de passe: Admin123!");
    console.log("🌐 URL: https://restaurant-app-peach-nine.vercel.app/login");
    
    await client.close();
  } catch (error) {
    if (error.message?.includes("User already exists") || error.message?.includes("EMAIL_ALREADY_USED")) {
      console.log("ℹ️  L'utilisateur admin existe déjà dans la production");
      console.log("📧 Email: admin@restaurant.com");
      console.log("🔑 Mot de passe: Admin123!");
      console.log("🌐 URL: https://restaurant-app-peach-nine.vercel.app/login");
    } else {
      console.error("❌ Erreur lors de la création de l'admin :", error.message);
      console.error("Full error:", error);
    }
  }
}

createProductionAdmin();
