import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import des dépendances
const { MongoClient } = require('mongodb');

const defaultContent = {
  heroSection: {
    title: "Chez nous,",
    subtitle: "il y en a pour ",
    highlightText: "tous les goûts"
  },
  infoBanner: {
    text: "De belles assiettes d'entrées, des grillades tendres et savoureuses, du poisson et des plats cuisinés. Nous n'oublions pas les plus petits avec un menu spécifique incluant une surprise. Nous sommes déjà ravis à la perspective de vous servir."
  },
  imageHighlight: {
    mainColor: "#ef4444",
    overlayColor: "#ef4444", 
    opacity: 30
  },
  menuSection: {
    title: "Découvrez ",
    subtitle: "",
    highlightText: "notre menu.",
    description: "Laissez-vous guider par nos suggestions, des entrées délicates aux grillades d'exception.\nPour nos jeunes gourmets, nous avons imaginé un menu tout en finesse, qui se conclut par une jolie surprise.",
    items: [
      {
        name: "Tapenade Provençale",
        category: "entree",
        description: "Olives, câpres et anchois finement mixés, servis avec croûtons.",
        price: "8€"
      },
      {
        name: "Velouté de courge",
        category: "entree",
        description: "Crémeux de courge musquée, crème fraîche et noisettes torréfiées.",
        price: "9€"
      },
      {
        name: "Steak‑frites",
        category: "plat",
        description: "Pièce de bœuf française, frites maison et sauce béarnaise.",
        price: "22€"
      },
      {
        name: "Filet de bar rôti",
        category: "plat",
        description: "Filet de bar, purée de panais et beurre blanc citronné.",
        price: "24€"
      },
      {
        name: "Tarte Tatin",
        category: "dessert",
        description: "Pommes caramélisées, pâte feuilletée et crème fraîche épaisse.",
        price: "7€"
      },
      {
        name: "Mousse au chocolat",
        category: "dessert",
        description: "Chocolat noir 70 %, pointe de fleur de sel.",
        price: "6€"
      }
    ]
  },
  updatedAt: new Date()
};

async function initContent() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'restaurant_app');
    const collection = db.collection('pageContent');

    // Vérifier si le contenu existe déjà
    const existingContent = await collection.findOne({});
    
    if (existingContent) {
      console.log("ℹ️  Le contenu de la page existe déjà");
    } else {
      // Insérer le contenu par défaut
      const result = await collection.insertOne(defaultContent);
      console.log("✅ Contenu de la page initialisé avec succès:", result.insertedId);
    }
    
    await client.close();
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation du contenu :", error.message);
  }
}

initContent(); 