import { z } from 'zod'

/**
 * Schémas de validation pour l'authentification
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
})

export const CreateAdminSchema = z.object({
  email: z
    .string()
    .email('Format d\'email invalide')
    .refine(email => email === 'admin@loon-garden.com', {
      message: 'Seul l\'email admin@loon-garden.com est autorisé'
    }),
  password: z
    .string()
    .min(8, 'Le mot de passe admin doit contenir au moins 8 caractères')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    })
})

/**
 * Schémas pour les éléments du menu
 */
export const MenuCategorySchema = z.enum(['entree', 'plat', 'dessert'], {
  errorMap: () => ({ message: 'La catégorie doit être entrée, plat ou dessert' })
})

export const MenuItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du plat est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),
  category: MenuCategorySchema,
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .trim(),
  price: z
    .string()
    .min(1, 'Le prix est requis')
    .max(20, 'Le prix ne peut pas dépasser 20 caractères')
    .regex(/^\d+(?:[.,]\d{1,2})?€?$/, {
      message: 'Format de prix invalide (ex: 15€, 15.50€, 15,50)'
    })
})

/**
 * Schémas pour les sections de contenu
 */
export const HeroSectionSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères')
    .trim(),
  subtitle: z
    .string()
    .min(1, 'Le sous-titre est requis')
    .max(100, 'Le sous-titre ne peut pas dépasser 100 caractères')
    .trim(),
  highlightText: z
    .string()
    .min(1, 'Le texte en évidence est requis')
    .max(100, 'Le texte en évidence ne peut pas dépasser 100 caractères')
    .trim()
})

export const InfoBannerSchema = z.object({
  text: z
    .string()
    .min(50, 'Le texte d\'information doit contenir au moins 50 caractères')
    .max(1000, 'Le texte ne peut pas dépasser 1000 caractères')
    .trim()
})

export const ColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Format de couleur invalide (ex: #FF0000 ou #F00)'
  })

export const ImageHighlightSchema = z.object({
  mainColor: ColorSchema,
  overlayColor: ColorSchema,
  opacity: z
    .number()
    .min(0, 'L\'opacité doit être entre 0 et 100')
    .max(100, 'L\'opacité doit être entre 0 et 100')
    .int('L\'opacité doit être un nombre entier')
})

export const MenuSectionSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre du menu est requis')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères')
    .trim(),
  subtitle: z
    .string()
    .max(100, 'Le sous-titre ne peut pas dépasser 100 caractères')
    .trim()
    .optional()
    .default(''),
  highlightText: z
    .string()
    .min(1, 'Le texte en évidence est requis')
    .max(100, 'Le texte en évidence ne peut pas dépasser 100 caractères')
    .trim(),
  description: z
    .string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .trim(),
  items: z
    .array(MenuItemSchema)
    .min(0, 'Le menu peut être vide')
    .max(50, 'Le menu ne peut pas contenir plus de 50 plats')
})

/**
 * Schéma principal pour le contenu de page
 */
export const PageContentSchema = z.object({
  heroSection: HeroSectionSchema,
  infoBanner: InfoBannerSchema,
  imageHighlight: ImageHighlightSchema,
  menuSection: MenuSectionSchema
})

/**
 * Schémas pour la configuration d'environnement
 */
export const EnvSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, 'MONGODB_URI est requis')
    .url('MONGODB_URI doit être une URL valide'),
  MONGODB_DB: z
    .string()
    .min(1, 'MONGODB_DB est requis')
    .max(50, 'Le nom de la base de données ne peut pas dépasser 50 caractères'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET doit contenir au moins 32 caractères')
    .max(256, 'BETTER_AUTH_SECRET ne peut pas dépasser 256 caractères'),
  BETTER_AUTH_URL: z
    .string()
    .url('BETTER_AUTH_URL doit être une URL valide'),
  ADMIN_EMAIL: z
    .string()
    .email('ADMIN_EMAIL doit être un email valide')
    .optional(),
  ADMIN_PASSWORD: z
    .string()
    .min(8, 'ADMIN_PASSWORD doit contenir au moins 8 caractères')
    .optional()
})

/**
 * Schémas pour les requêtes API
 */
export const UpdateContentRequestSchema = PageContentSchema

export const CreateMenuItemRequestSchema = MenuItemSchema

export const UpdateMenuItemRequestSchema = MenuItemSchema.extend({
  id: z.string().min(1, 'L\'ID du plat est requis')
})

export const DeleteMenuItemRequestSchema = z.object({
  id: z.string().min(1, 'L\'ID du plat est requis')
})

/**
 * Types TypeScript dérivés des schémas Zod
 */
export type LoginFormData = z.infer<typeof LoginSchema>
export type CreateAdminData = z.infer<typeof CreateAdminSchema>
export type MenuItem = z.infer<typeof MenuItemSchema>
export type MenuCategory = z.infer<typeof MenuCategorySchema>
export type HeroSection = z.infer<typeof HeroSectionSchema>
export type InfoBanner = z.infer<typeof InfoBannerSchema>
export type ImageHighlight = z.infer<typeof ImageHighlightSchema>
export type MenuSection = z.infer<typeof MenuSectionSchema>
export type PageContent = z.infer<typeof PageContentSchema>
export type EnvConfig = z.infer<typeof EnvSchema>

/**
 * Utilitaires de validation
 */
export const validateEnv = () => {
  try {
    return EnvSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Configuration d\'environnement invalide:')
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
    }
    process.exit(1)
  }
}

/**
 * Validation côté serveur avec messages d'erreur localisés
 */
export const validatePageContent = (data: unknown) => {
  const result = PageContentSchema.safeParse(data)
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }))
    return { success: false, errors }
  }
  return { success: true, data: result.data }
}

export const validateMenuItem = (data: unknown) => {
  const result = MenuItemSchema.safeParse(data)
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }))
    return { success: false, errors }
  }
  return { success: true, data: result.data }
}

/**
 * Sanitization des données utilisateur
 */
export const sanitizeHtml = (text: string): string => {
  return text
    .replace(/[<>]/g, '') // Supprimer les balises HTML de base
    .replace(/javascript:/gi, '') // Supprimer les URLs javascript
    .replace(/on\w+=/gi, '') // Supprimer les event handlers
    .trim()
}

export const sanitizePageContent = (data: PageContent): PageContent => {
  return {
    heroSection: {
      title: sanitizeHtml(data.heroSection.title),
      subtitle: sanitizeHtml(data.heroSection.subtitle),
      highlightText: sanitizeHtml(data.heroSection.highlightText)
    },
    infoBanner: {
      text: sanitizeHtml(data.infoBanner.text)
    },
    imageHighlight: data.imageHighlight, // Les couleurs sont déjà validées par regex
    menuSection: {
      title: sanitizeHtml(data.menuSection.title),
      subtitle: sanitizeHtml(data.menuSection.subtitle || ''),
      highlightText: sanitizeHtml(data.menuSection.highlightText),
      description: sanitizeHtml(data.menuSection.description),
      items: data.menuSection.items.map(item => ({
        name: sanitizeHtml(item.name),
        category: item.category,
        description: sanitizeHtml(item.description),
        price: sanitizeHtml(item.price)
      }))
    }
  }
} 