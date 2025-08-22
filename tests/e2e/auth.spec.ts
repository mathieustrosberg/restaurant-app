import { test, expect } from './fixtures/test-data';
import { TEST_USERS } from './fixtures/test-data';

test.describe('Authentification', () => {
  test.beforeEach(async ({ page }) => {
    // S'assurer que nous partons d'un état déconnecté
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('affiche la page de connexion correctement', async ({ page }) => {
    await page.goto('/login');
    
    // Vérifier les éléments essentiels de la page
    await expect(page.locator('h1', { hasText: 'Connexion' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]', { hasText: 'Se connecter' })).toBeVisible();
    
    // Vérifier les liens légaux
    await expect(page.locator('a', { hasText: 'Mentions légales' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Politique de confidentialité' })).toBeVisible();
    
    // Vérifier le logo/icône
    await expect(page.locator('[data-testid="chef-hat-icon"], .lucide-chef-hat')).toBeVisible();
    
    // Vérifier le texte d'information
    await expect(page.locator('text=Accès réservé aux administrateurs')).toBeVisible();
  });

  test('connexion réussie avec identifiants valides', async ({ page }) => {
    await page.goto('/login');
    
    // Remplir le formulaire avec des identifiants valides
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', TEST_USERS.admin.password);
    
    // Cliquer sur le bouton de connexion
    await page.click('button[type="submit"]');
    
    // Vérifier que nous sommes redirigés vers le dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL('/dashboard');
    
    // Vérifier que le dashboard s'affiche correctement
    await expect(page.locator('text=Restaurant Admin')).toBeVisible();
    await expect(page.locator('text=Gestion du contenu')).toBeVisible();
  });

  test('échec de connexion avec email invalide', async ({ page }) => {
    await page.goto('/login');
    
    // Remplir avec un email invalide
    await page.fill('input[type="email"]', 'invalide@test.com');
    await page.fill('input[type="password"]', 'motdepasse');
    
    // Soumettre le formulaire
    await page.click('button[type="submit"]');
    
    // Vérifier qu'un message d'erreur apparaît
    await expect(page.locator('.text-red-500, [data-testid="error-message"]')).toBeVisible();
    
    // Vérifier que nous restons sur la page de connexion
    await expect(page).toHaveURL('/login');
  });

  test('échec de connexion avec mot de passe invalide', async ({ page }) => {
    await page.goto('/login');
    
    // Remplir avec un mot de passe invalide
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', 'mauvais-mot-de-passe');
    
    // Soumettre le formulaire
    await page.click('button[type="submit"]');
    
    // Vérifier qu'un message d'erreur apparaît
    await expect(page.locator('.text-red-500, [data-testid="error-message"]')).toBeVisible();
    
    // Vérifier que nous restons sur la page de connexion
    await expect(page).toHaveURL('/login');
  });

  test('affiche l\'état de chargement pendant la connexion', async ({ page }) => {
    await page.goto('/login');
    
    // Remplir le formulaire
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', TEST_USERS.admin.password);
    
    // Cliquer et vérifier l'état de chargement
    await page.click('button[type="submit"]');
    
    // Le bouton doit afficher "Connexion…" et être désactivé
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveText('Connexion…');
    await expect(submitButton).toBeDisabled();
    
    // Attendre la fin du processus
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });

  test('gère les champs requis', async ({ page }) => {
    await page.goto('/login');
    
    // Essayer de soumettre sans remplir les champs
    await page.click('button[type="submit"]');
    
    // Les champs doivent avoir l'attribut required
    await expect(page.locator('input[type="email"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[type="password"]')).toHaveAttribute('required', '');
  });

  test('valide le format email', async ({ page }) => {
    await page.goto('/login');
    
    // Tenter avec un format email invalide
    await page.fill('input[type="email"]', 'email-invalide');
    await page.fill('input[type="password"]', 'motdepasse');
    
    // Le navigateur devrait empêcher la soumission (validation HTML5)
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('déconnexion depuis le dashboard', async ({ authenticatedPage: page }) => {
    // Nous sommes déjà connectés grâce à la fixture
    await expect(page).toHaveURL('/dashboard');
    
    // Cliquer sur le bouton de déconnexion
    await page.click('button:has-text("Se déconnecter")');
    
    // Vérifier la redirection vers la page de connexion
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
    
    // Vérifier que nous ne pouvons plus accéder au dashboard
    await page.goto('/dashboard');
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
  });

  test('protège les routes privées sans authentification', async ({ page }) => {
    // Essayer d'accéder au dashboard sans être connecté
    await page.goto('/dashboard');
    
    // Doit être redirigé vers la page de connexion
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
  });

  test('redirige vers la page demandée après connexion', async ({ page }) => {
    // Essayer d'accéder au dashboard (sera redirigé vers login)
    await page.goto('/dashboard');
    await page.waitForURL('/login');
    
    // Se connecter
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');
    
    // Doit être redirigé vers le dashboard demandé initialement
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });

  test('maintient la session après rechargement', async ({ authenticatedPage: page }) => {
    // Nous sommes connectés, vérifier que nous sommes sur le dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Restaurant Admin')).toBeVisible();
    
    // Recharger la page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Vérifier que nous sommes toujours connectés
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Restaurant Admin')).toBeVisible();
  });

  test('navigation par le lien retour à l\'accueil', async ({ page }) => {
    await page.goto('/login');
    
    // Cliquer sur le lien du logo qui ramène à l'accueil
    await page.click('a[href="/"]');
    
    // Vérifier la navigation vers l'accueil
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('navigation vers les pages légales', async ({ page }) => {
    await page.goto('/login');
    
    // Tester le lien vers les mentions légales
    const mentionsLink = page.locator('a[href="/mentions-legales"]');
    await expect(mentionsLink).toBeVisible();
    await mentionsLink.click();
    await page.waitForURL('/mentions-legales');
    await expect(page).toHaveURL('/mentions-legales');
    
    // Retourner à la page de login
    await page.goto('/login');
    
    // Tester le lien vers la politique de confidentialité
    const privacyLink = page.locator('a[href="/politique-de-confidentialite"]');
    await expect(privacyLink).toBeVisible();
    await privacyLink.click();
    await page.waitForURL('/politique-de-confidentialite');
    await expect(page).toHaveURL('/politique-de-confidentialite');
  });

  test('gestion des erreurs réseau', async ({ page }) => {
    await page.goto('/login');
    
    // Simuler une panne réseau
    await page.route('**/api/auth/**', route => route.abort('failed'));
    
    // Tenter de se connecter
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');
    
    // Vérifier qu'un message d'erreur réseau apparaît
    await expect(page.locator('.text-red-500:has-text("réseau"), .text-red-500:has-text("erreur")')).toBeVisible();
  });

  test('accessibilité du formulaire de connexion', async ({ page }) => {
    await page.goto('/login');
    
    // Vérifier les labels associés aux champs
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toHaveAttribute('id', 'email');
    await expect(passwordInput).toHaveAttribute('id', 'password');
    
    // Vérifier la présence des labels
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();
    
    // Vérifier la navigation au clavier
    await emailInput.focus();
    await expect(emailInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(passwordInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });
});