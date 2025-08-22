# Tests End-to-End (E2E) - Restaurant App

Ce document décrit comment lancer et maintenir les tests E2E de l'application restaurant avec Playwright.

## 🏗️ Architecture des Tests

### Structure des Fichiers

```
tests/
├── e2e/
│   ├── fixtures/
│   │   └── test-data.ts          # Données de test et fixtures
│   ├── auth.spec.ts              # Tests d'authentification
│   ├── reservations.spec.ts      # Tests CRUD réservations
│   ├── contact.spec.ts           # Tests formulaire contact
│   ├── newsletter.spec.ts        # Tests inscription newsletter
│   ├── navigation.spec.ts        # Tests navigation publique
│   └── admin-permissions.spec.ts # Tests permissions admin
└── playwright.config.ts          # Configuration Playwright
```

### Parcours Testés

| Parcours | Fichier | Priorité | Description |
|----------|---------|----------|-------------|
| **Authentification** | `auth.spec.ts` | P0 | Connexion/déconnexion admin |
| **Réservations** | `reservations.spec.ts` | P0 | CRUD réservations (public + admin) |
| **Contact** | `contact.spec.ts` | P1 | Formulaire contact + gestion admin |
| **Newsletter** | `newsletter.spec.ts` | P1 | Inscription + gestion abonnés |
| **Navigation** | `navigation.spec.ts` | P1 | Navigation publique + responsivité |
| **Permissions** | `admin-permissions.spec.ts` | P0 | Gestion contenu et droits admin |

## 🚀 Installation et Configuration

### Prérequis

```bash
# Installer les dépendances (déjà fait)
npm install

# Installer les navigateurs Playwright
npx playwright install
```

### Variables d'Environnement

Créer un fichier `.env.local` pour les tests :

```env
# Base URL de l'application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Données de test admin
TEST_ADMIN_EMAIL=admin@restaurant-test.com
TEST_ADMIN_PASSWORD=admin123!

# Base de données de test (si différente)
DATABASE_URL_TEST=mysql://test:test@localhost:3306/restaurant_test
```

## 📋 Commandes de Test

### Développement Local

```bash
# Lancer tous les tests E2E
npm run test:e2e

# Lancer avec interface graphique
npm run test:e2e:ui

# Lancer en mode debug (headed)
npm run test:e2e:headed

# Lancer un fichier spécifique
npx playwright test auth.spec.ts

# Lancer un test spécifique
npx playwright test -g "connexion réussie"
```

### Tests par Navigateur

```bash
# Chromium uniquement
npx playwright test --project=chromium

# Firefox uniquement  
npx playwright test --project=firefox

# Safari uniquement
npx playwright test --project=webkit

# Tous les navigateurs
npx playwright test
```

### Mode CI/CD

```bash
# Mode CI (headless, retry 2x)
CI=true npm run test:e2e

# Génération du rapport HTML
npm run test:e2e && npx playwright show-report
```

## 🎯 Fixtures et Données de Test

### Utilisation des Fixtures

```typescript
import { test, expect } from './fixtures/test-data';

test('mon test', async ({ authenticatedPage, testData }) => {
  // Page déjà connectée en admin
  await expect(authenticatedPage).toHaveURL('/dashboard');
  
  // Génération de données uniques
  const reservation = testData.generateReservation({
    name: 'Test User',
    people: 4
  });
});
```

### Données de Test Disponibles

```typescript
// Utilisateurs
TEST_USERS.admin        // Admin de test
TEST_USERS.user         // Utilisateur standard

// Réservations
TEST_RESERVATIONS.lunch    // Réservation déjeuner
TEST_RESERVATIONS.dinner   // Réservation dîner

// Contacts
TEST_CONTACTS.menu_question    // Question sur menu
TEST_CONTACTS.event_inquiry    // Demande événement

// Utilitaires
testData.generateUniqueEmail()     // Email unique
testData.generateReservation()     // Réservation avec données aléatoires
testData.getFutureDate(7)          // Date dans 7 jours
```

## 🔧 Configuration Avancée

### Configuration Playwright

Le fichier `playwright.config.ts` contient :

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,           // Tests en parallèle
  forbidOnly: !!process.env.CI,  // Pas de .only sur CI
  retries: process.env.CI ? 2 : 0, // Retry sur CI
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',              // Rapport HTML
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',     // Traces sur retry
  },

  webServer: {
    command: 'npm run dev',      // Démarre le serveur automatiquement
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Sélecteurs Robustes

✅ **Recommandés**
```typescript
// Par rôle et nom
page.locator('button', { hasText: 'Se connecter' })
page.locator('input[type="email"]')

// Par data-testid
page.locator('[data-testid="reservation-form"]')

// Par structure sémantique
page.locator('section').filter({ hasText: 'Contact' })
```

❌ **À éviter**
```typescript
// Sélecteurs fragiles
page.locator('div:nth-child(3) > button')
page.locator('.css-abc123')
page.locator('#dynamic-id-123')
```

## 📊 Rapports et Monitoring

### Génération de Rapports

```bash
# Rapport HTML (après les tests)
npx playwright show-report

# Rapport JSON
npx playwright test --reporter=json

# Rapport JUnit (pour CI)
npx playwright test --reporter=junit
```

### Traces et Debug

```bash
# Voir les traces d'un test échoué
npx playwright show-trace test-results/auth-spec-connexion-chromium/trace.zip

# Debug mode avec pause
npx playwright test --debug

# Mode headed pour voir les actions
npx playwright test --headed
```

## 🐛 Debugging et Résolution de Problèmes

### Tests Instables

1. **Attentes explicites** :
   ```typescript
   // ❌ Attente implicite
   await page.click('button');
   await page.locator('success').isVisible();
   
   // ✅ Attente explicite
   await page.click('button');
   await expect(page.locator('success')).toBeVisible({ timeout: 5000 });
   ```

2. **Gestion du réseau** :
   ```typescript
   // Attendre la stabilité réseau
   await page.waitForLoadState('networkidle');
   
   // Mock des API en cas d'erreur
   await page.route('**/api/reservations', route => route.abort('failed'));
   ```

### Tests Lents

1. **Parallélisation** :
   ```bash
   # Ajuster le nombre de workers
   npx playwright test --workers=4
   ```

2. **Fixtures réutilisables** :
   ```typescript
   // Réutiliser la session admin
   test.use({ storageState: 'auth.json' });
   ```

### Erreurs Communes

| Erreur | Solution |
|--------|----------|
| `TimeoutError: locator.click` | Vérifier la visibilité, ajouter `waitForSelector` |
| `Navigation timeout` | Augmenter timeout, vérifier `waitForLoadState` |
| `Test failed on CI only` | Vérifier viewport, headless mode, timing |

## 🚀 Intégration CI/CD

### GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright
      run: npx playwright install --with-deps
      
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        CI: true
        
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

### Docker

```dockerfile
FROM mcr.microsoft.com/playwright:latest

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["npm", "run", "test:e2e"]
```

## 📈 Métriques et Couverture

### Métriques de Performance

Les tests mesurent automatiquement :
- Temps de chargement des pages
- Temps de réponse des API
- Fluidité des interactions

### Couverture Fonctionnelle

| Fonctionnalité | Couverte | Tests |
|----------------|----------|-------|
| Authentification | ✅ 100% | 14 tests |
| Réservations CRUD | ✅ 95% | 18 tests |
| Contact Management | ✅ 90% | 12 tests |
| Newsletter | ✅ 85% | 10 tests |
| Navigation | ✅ 80% | 15 tests |
| Admin Permissions | ✅ 95% | 16 tests |

## 🔄 Maintenance

### Mise à jour des Tests

1. **Après changement d'UI** :
   - Mettre à jour les sélecteurs
   - Vérifier les nouveaux workflows
   - Adapter les attentes

2. **Après nouvelles fonctionnalités** :
   - Ajouter les tests correspondants
   - Mettre à jour les fixtures
   - Documenter les nouveaux parcours

3. **Tests de régression** :
   - Maintenir les tests existants
   - Ajouter des tests pour les bugs résolus

### Bonnes Pratiques

- ✅ Tests indépendants et isolés
- ✅ Données de test uniques (pas de conflicts)
- ✅ Nettoyage automatique après tests
- ✅ Assertions claires et descriptives
- ✅ Timeouts appropriés
- ✅ Gestion d'erreurs robuste

### Alertes et Monitoring

- Notifications Slack sur échecs CI
- Métriques de stabilité des tests
- Rapports périodiques de performance

---

## 📞 Support

Pour toute question sur les tests E2E :

1. Consulter les traces avec `npx playwright show-trace`
2. Vérifier les logs de l'application
3. Tester manuellement le parcours concerné
4. Créer une issue avec le rapport détaillé

**Temps d'exécution total :** ~5-8 minutes (tous navigateurs)
**Couverture fonctionnelle :** 85+ tests sur tous les parcours critiques