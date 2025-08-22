import { test, expect } from '@playwright/test'

test.describe('Page d\'accueil', () => {
  test('affiche la page d\'accueil correctement', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier que la page se charge
    await expect(page).toHaveTitle(/Restaurant/)
    
    // Vous pouvez ajouter d'autres vérifications en fonction de votre contenu
    // Par exemple, vérifier la présence d'éléments spécifiques
  })

  test('navigation fonctionne correctement', async ({ page }) => {
    await page.goto('/')
    
    // Exemple de test de navigation - adaptez selon votre structure
    // await page.click('text=Menu')
    // await expect(page.url()).toContain('/menu')
  })

  test('formulaire de contact fonctionne', async ({ page }) => {
    await page.goto('/')
    
    // Exemple de test de formulaire - adaptez selon vos composants
    // await page.fill('[data-testid="name-input"]', 'John Doe')
    // await page.fill('[data-testid="email-input"]', 'john@example.com')
    // await page.fill('[data-testid="message-input"]', 'Bonjour!')
    // await page.click('[data-testid="submit-button"]')
    // await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })

  test('responsive design fonctionne', async ({ page }) => {
    // Test sur mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Vérifier que le menu mobile est présent
    // await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Test sur desktop
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto('/')
    
    // Vérifier que le menu desktop est présent
    // await expect(page.locator('[data-testid="desktop-menu"]')).toBeVisible()
  })
})
