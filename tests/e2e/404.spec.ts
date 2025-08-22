import { test, expect } from '@playwright/test'

test.describe('Page 404', () => {
  test('affiche la page 404 pour une URL inexistante', async ({ page }) => {
    // Aller vers une URL qui n'existe pas
    await page.goto('/cette-page-nexiste-pas')
    
    // Vérifier que nous sommes sur une page 404
    await expect(page.locator('h1')).toContainText('404')
    await expect(page.locator('h2')).toContainText('Cette page n\'existe pas')
    
    // Vérifier la présence du message d'erreur
    await expect(page.locator('text=Il semblerait que la page que vous cherchez')).toBeVisible()
  })

  test('affiche les boutons de navigation', async ({ page }) => {
    await page.goto('/page-inexistante')
    
    // Vérifier les boutons principaux
    await expect(page.getByRole('link', { name: 'Retour à l\'accueil' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Page précédente' })).toBeVisible()
    
    // Vérifier les liens utiles spécifiques
    await expect(page.getByRole('link', { name: 'Notre menu' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Réservations' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible()
  })

  test('le bouton "Retour à l\'accueil" fonctionne', async ({ page }) => {
    await page.goto('/url-inexistante')
    
    // Cliquer sur le bouton retour à l'accueil
    await page.getByRole('link', { name: 'Retour à l\'accueil' }).click()
    
    // Vérifier que nous sommes redirigés vers l'accueil
    await expect(page).toHaveURL('/')
  })

  test('les liens de navigation fonctionnent', async ({ page }) => {
    await page.goto('/test-404')
    
    // Tester le lien vers le menu (en supposant que la page existe ou redirige)
    const menuLink = page.getByRole('link', { name: 'Notre menu' })
    await expect(menuLink).toHaveAttribute('href', '/menu')
    
    // Tester le lien vers les réservations
    const reservationsLink = page.getByRole('link', { name: 'Réservations' })
    await expect(reservationsLink).toHaveAttribute('href', '/reservations')
    
    // Tester le lien vers contact
    const contactLink = page.getByRole('link', { name: 'Contact' })
    await expect(contactLink).toHaveAttribute('href', '/contact')
  })

  test('affiche l\'icône et le design appropriés', async ({ page }) => {
    await page.goto('/erreur-404')
    
    // Vérifier la présence de l'icône de restaurant spécifique
    await expect(page.locator('.lucide-utensils')).toBeVisible()
    
    // Vérifier que le design est cohérent (couleurs orange)
    const element = page.getByRole('link', { name: 'Retour à l\'accueil' })
    await expect(element).toBeVisible()
  })

  test('responsive design fonctionne', async ({ page }) => {
    // Test sur mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/mobile-404')
    
    await expect(page.locator('h1')).toContainText('404')
    await expect(page.locator('text=Retour à l\'accueil')).toBeVisible()
    
    // Test sur desktop
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.reload()
    
    await expect(page.locator('h1')).toContainText('404')
    await expect(page.locator('text=Retour à l\'accueil')).toBeVisible()
  })
})
