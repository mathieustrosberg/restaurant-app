import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db(process.env.MONGODB_DB || 'restaurant_app')

export interface MenuItem {
  name: string
  category: 'entree' | 'plat' | 'dessert'
  description: string
  price: string
}

export interface PageContent {
  _id?: string
  heroSection: {
    title: string
    subtitle: string
    highlightText: string
  }
  infoBanner: {
    text: string
  }
  imageHighlight: {
    mainColor: string
    overlayColor: string
    opacity: number
  }
  menuSection: {
    title: string
    subtitle: string
    highlightText: string
    description: string
    items: MenuItem[]
  }
  updatedAt: Date
}

export async function getPageContent(): Promise<PageContent | null> {
  try {
    await client.connect()
    const collection = db.collection<PageContent>('pageContent')
    const content = await collection.findOne({})
    return content
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error)
    return null
  }
}

export async function updatePageContent(content: Omit<PageContent, '_id' | 'updatedAt'>): Promise<boolean> {
  try {
    await client.connect()
    const collection = db.collection<PageContent>('pageContent')
    const result = await collection.updateOne(
      {},
      { 
        $set: { 
          ...content, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    )
    return result.acknowledged
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu:', error)
    return false
  }
}

export async function getDefaultContent(): Promise<Omit<PageContent, '_id' | 'updatedAt'>> {
  return {
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
    }
  }
} 