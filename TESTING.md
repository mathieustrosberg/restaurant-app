# Guide de Test pour Restaurant App

Ce projet utilise **Jest** pour les tests unitaires et **Playwright** pour les tests end-to-end.

## Structure des Tests

```
📁 tests/
├── 📁 e2e/              # Tests end-to-end avec Playwright
│   ├── homepage.spec.ts
│   ├── auth.spec.ts
│   ├── contact.spec.ts
│   ├── reservations.spec.ts
│   └── fixtures/        # Données de test
└── 📁 unit/            # Tests unitaires avec Jest
    ├── 📁 components/   # Tests des composants React
    ├── 📁 lib/          # Tests des utilitaires
    └── 📁 hooks/        # Tests des hooks personnalisés
```

## Scripts Disponibles

### Tests Unitaires (Jest)
```bash
# Exécuter tous les tests unitaires
npm run test

# Exécuter les tests en mode watch
npm run test:watch

# Exécuter les tests avec rapport de couverture
npm run test:coverage
```

### Tests End-to-End (Playwright)
```bash
# Exécuter tous les tests e2e
npm run test:e2e

# Exécuter les tests avec interface utilisateur
npm run test:e2e:ui

# Exécuter les tests en mode headed (avec navigateur visible)
npm run test:e2e:headed

# Exécuter tous les tests (unitaires + e2e)
npm run test:all
```

## Configuration

### Jest
- **Fichier de config** : `jest.config.ts`
- **Setup** : `jest.setup.ts`
- **Environnement** : jsdom (pour simuler le DOM)
- **Couverture** : v8

### Playwright
- **Fichier de config** : `playwright.config.ts`
- **Navigateurs** : Chromium, Firefox, WebKit
- **URL de base** : http://localhost:3000
- **Rapports** : HTML

## Écriture de Tests

### Tests Unitaires
Placez vos tests dans `tests/unit/` :

```typescript
// tests/unit/components/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('rend correctement', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### Tests End-to-End
Placez vos tests dans `tests/e2e/` :

```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('navigation fonctionne', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Menu')
  await expect(page).toHaveURL('/menu')
})
```

## Conseils

1. **Tests unitaires** : Testez la logique des composants isolément
2. **Tests e2e** : Testez les parcours utilisateur complets
3. **Data-testid** : Utilisez `data-testid` pour des sélecteurs stables
4. **Mocking** : Moquez les appels API dans les tests unitaires
5. **Attentes** : Soyez spécifique dans vos assertions

## Débogage

### Jest
```bash
# Déboguer un test spécifique
npm run test -- --watchAll=false Button.test.tsx
```

### Playwright
```bash
# Mode debug interactif
npm run test:e2e -- --debug

# Voir les traces d'un test
npm run test:e2e -- --trace on
```

## CI/CD

Les tests sont configurés pour s'exécuter automatiquement en CI avec :
- Jest en mode CI optimisé
- Playwright avec retry automatique
- Rapports de couverture générés
