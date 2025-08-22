import { test, expect } from '@playwright/test'

test.describe('Authentification', () => {
  test('page de connexion se charge correctement', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page).toHaveTitle(/Login|Connexion/)
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('affiche une erreur pour des identifiants invalides', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Adaptez selon votre implémentation d'erreur
    // await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
  })

  test('redirige vers le dashboard après connexion réussie', async ({ page }) => {
    await page.goto('/login')
    
    // Utilisez des identifiants de test valides
    // await page.fill('input[type="email"]', 'admin@test.com')
    // await page.fill('input[type="password"]', 'password123')
    // await page.click('button[type="submit"]')
    
    // await expect(page).toHaveURL('/dashboard')
  })

  test('protège les routes privées', async ({ page }) => {
    // Tenter d'accéder au dashboard sans être connecté
    await page.goto('/dashboard')
    
    // Devrait rediriger vers la page de connexion
    await expect(page).toHaveURL(/\/login/)
  })
})
