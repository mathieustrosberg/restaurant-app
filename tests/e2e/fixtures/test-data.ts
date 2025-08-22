import { test as base, expect } from '@playwright/test';

// Types pour les données de test
export interface TestUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

export interface TestReservation {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: 'lunch' | 'dinner';
  people: number;
  notes?: string;
}

export interface TestContact {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface TestSubscriber {
  email: string;
}

export interface TestMenu {
  category: string;
  items: Array<{
    name: string;
    description: string;
    price: string;
  }>;
}

// Données de test
export const TEST_USERS: Record<string, TestUser> = {
  admin: {
    email: 'admin@restaurant-test.com',
    password: 'admin123!',
    name: 'Admin Test',
    role: 'admin'
  },
  user: {
    email: 'user@restaurant-test.com',
    password: 'user123!',
    name: 'User Test',
    role: 'user'
  }
};

export const TEST_RESERVATIONS: Record<string, TestReservation> = {
  lunch: {
    name: 'Pierre Durand',
    email: 'pierre.durand@test.com',
    phone: '0123456789',
    date: '2024-12-25',
    time: '12:30',
    service: 'lunch',
    people: 2,
    notes: 'Allergie aux fruits de mer'
  },
  dinner: {
    name: 'Marie Martin',
    email: 'marie.martin@test.com',
    phone: '0987654321',
    date: '2024-12-24',
    time: '19:30',
    service: 'dinner',
    people: 4,
    notes: 'Table près de la fenêtre si possible'
  },
  large_party: {
    name: 'Jean Entreprise',
    email: 'jean@entreprise-test.com',
    phone: '0156789012',
    date: '2024-12-31',
    time: '20:00',
    service: 'dinner',
    people: 8,
    notes: 'Repas d\'entreprise - facture nécessaire'
  }
};

export const TEST_CONTACTS: Record<string, TestContact> = {
  menu_question: {
    name: 'Sophie Dubois',
    email: 'sophie.dubois@test.com',
    subject: 'Question sur les menus végétariens',
    message: 'Bonjour, avez-vous des options végétariennes dans votre carte ? Je suis végétalienne et j\'aimerais savoir si vous proposez des plats adaptés.'
  },
  reservation_issue: {
    name: 'Michel Leroy',
    email: 'michel.leroy@test.com',
    subject: 'Problème avec ma réservation',
    message: 'J\'ai fait une réservation pour ce soir mais je n\'ai pas reçu d\'email de confirmation. Pouvez-vous vérifier ?'
  },
  event_inquiry: {
    name: 'Laura Rousseau',
    email: 'laura.rousseau@test.com',
    subject: 'Organisation d\'événement privé',
    message: 'Nous souhaitons organiser un anniversaire pour 30 personnes. Proposez-vous des formules pour les événements privés ?'
  }
};

export const TEST_SUBSCRIBERS: Record<string, TestSubscriber> = {
  subscriber1: { email: 'newsletter1@test.com' },
  subscriber2: { email: 'newsletter2@test.com' },
  subscriber3: { email: 'newsletter3@test.com' }
};

export const TEST_MENU: Record<string, TestMenu> = {
  entrees: {
    category: 'entrees',
    items: [
      {
        name: 'Salade de chèvre chaud',
        description: 'Salade verte, tomates cerises, noix et fromage de chèvre chaud',
        price: '12€'
      },
      {
        name: 'Foie gras maison',
        description: 'Foie gras fait maison, toast brioche et confiture de figues',
        price: '18€'
      }
    ]
  },
  plats: {
    category: 'plats',
    items: [
      {
        name: 'Filet de bœuf',
        description: 'Filet de bœuf grillé, légumes de saison et sauce au poivre',
        price: '26€'
      },
      {
        name: 'Saumon grillé',
        description: 'Saumon grillé, purée de patates douces et beurre blanc',
        price: '22€'
      }
    ]
  },
  desserts: {
    category: 'desserts',
    items: [
      {
        name: 'Tarte tatin',
        description: 'Tarte tatin aux pommes, glace vanille et caramel beurre salé',
        price: '9€'
      },
      {
        name: 'Mousse au chocolat',
        description: 'Mousse au chocolat noir 70%, crème chantilly et éclats de noisettes',
        price: '8€'
      }
    ]
  }
};

// Utilitaires pour les tests
export const TEST_UTILS = {
  // Génère une date future pour les réservations
  getFutureDate: (daysFromNow: number = 7): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  },

  // Génère un email unique pour éviter les conflits
  generateUniqueEmail: (prefix: string = 'test'): string => {
    const timestamp = Date.now();
    return `${prefix}-${timestamp}@playwright-test.com`;
  },

  // Génère des données de réservation avec des valeurs uniques
  generateReservation: (overrides: Partial<TestReservation> = {}): TestReservation => {
    const baseReservation = TEST_RESERVATIONS.lunch;
    return {
      ...baseReservation,
      email: TEST_UTILS.generateUniqueEmail('reservation'),
      date: TEST_UTILS.getFutureDate(),
      ...overrides
    };
  },

  // Génère des données de contact avec des valeurs uniques
  generateContact: (overrides: Partial<TestContact> = {}): TestContact => {
    const baseContact = TEST_CONTACTS.menu_question;
    return {
      ...baseContact,
      email: TEST_UTILS.generateUniqueEmail('contact'),
      ...overrides
    };
  },

  // Génère un subscriber unique
  generateSubscriber: (): TestSubscriber => ({
    email: TEST_UTILS.generateUniqueEmail('newsletter')
  }),

  // Attendre qu'un élément soit visible et interactable
  waitForElement: async (page: any, selector: string, timeout: number = 5000) => {
    await page.waitForSelector(selector, { timeout, state: 'visible' });
    return page.locator(selector);
  },

  // Vérifier qu'une page s'est bien chargée
  waitForPageLoad: async (page: any, expectedUrl?: string) => {
    await page.waitForLoadState('networkidle');
    if (expectedUrl) {
      await expect(page).toHaveURL(new RegExp(expectedUrl));
    }
  },

  // Nettoyer une chaîne pour les sélecteurs
  sanitizeSelector: (text: string): string => {
    return text.replace(/[^a-zA-Z0-9\-_]/g, '');
  }
};

// Fixture personnalisée avec authentification
export const test = base.extend<{
  authenticatedPage: any;
  testData: typeof TEST_UTILS;
}>({
  // Page authentifiée en tant qu'admin
  authenticatedPage: async ({ page }, use) => {
    // Aller à la page de login
    await page.goto('/login');
    
    // Remplir le formulaire de connexion
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', TEST_USERS.admin.password);
    
    // Soumettre le formulaire
    await page.click('button[type="submit"]');
    
    // Attendre la redirection vers le dashboard
    await page.waitForURL('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Vérifier que nous sommes bien connectés
    await expect(page.locator('text=Restaurant Admin')).toBeVisible();
    
    await use(page);
  },

  // Utilitaires de données de test
  testData: async ({}, use) => {
    await use(TEST_UTILS);
  }
});

export { expect };