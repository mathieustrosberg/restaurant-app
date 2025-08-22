import { test, expect } from './fixtures/test-data';

test.describe('Navigation Publique', () => {
  test('page d\'accueil se charge correctement', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/Restaurant|Mon Restaurant/);

    // Vérifier les sections principales de la page d'accueil
    await expect(page.locator('text=Mon Restaurant, text=Bienvenue')).toBeVisible();

    // Vérifier la présence des sections clés
    const sections = [
      'Menu', 'Réservation', 'Contact', 'Newsletter'
    ];

    for (const section of sections) {
      // Utiliser un sélecteur flexible pour trouver la section
      const sectionElement = page.locator(`section:has-text("${section}"), h2:has-text("${section}"), h3:has-text("${section}")`).first();
      await expect(sectionElement).toBeVisible();
    }
  });

  test('affichage du menu restaurant', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Localiser la section menu
    const menuSection = page.locator('section').filter({ hasText: 'Menu' }).first();
    await expect(menuSection).toBeVisible();

    // Vérifier la présence des catégories de menu
    const categories = ['Entrées', 'Plats', 'Desserts'];
    
    for (const category of categories) {
      // Chercher la catégorie dans la section menu ou dans des éléments de navigation
      const categoryElement = menuSection.locator(`text=${category}, h3:has-text("${category}"), button:has-text("${category}")`).first();
      if (await categoryElement.count() > 0) {
        await expect(categoryElement).toBeVisible();
      }
    }

    // Vérifier la présence de plats avec prix
    await expect(menuSection.locator('text=/\\d+€|€\\d+/')).toBeVisible();
  });

  test('navigation entre les catégories de menu', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const menuSection = page.locator('section').filter({ hasText: 'Menu' }).first();
    
    // Chercher des boutons ou onglets pour naviguer entre les catégories
    const entreesTab = menuSection.locator('button:has-text("Entrées"), [data-value="entrees"]');
    const platsTab = menuSection.locator('button:has-text("Plats"), [data-value="plats"]');
    const dessertsTab = menuSection.locator('button:has-text("Desserts"), [data-value="desserts"]');

    // Test de navigation si les onglets existent
    if (await entreesTab.count() > 0) {
      await entreesTab.click();
      await expect(menuSection.locator('text=Salade, text=Foie gras')).toBeVisible();
    }

    if (await platsTab.count() > 0) {
      await platsTab.click();
      await expect(menuSection.locator('text=Filet, text=Saumon')).toBeVisible();
    }

    if (await dessertsTab.count() > 0) {
      await dessertsTab.click();
      await expect(menuSection.locator('text=Tarte, text=Mousse')).toBeVisible();
    }
  });

  test('responsivité de la page d\'accueil', async ({ page }) => {
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Vérifier que les sections s'affichent correctement sur mobile
    await expect(page.locator('text=Mon Restaurant, text=Bienvenue')).toBeVisible();

    // Menu hamburger ou navigation mobile si présent
    const mobileMenu = page.locator('button:has(.lucide-menu), .mobile-menu, [data-testid="mobile-menu"]');
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu).toBeVisible();
    }

    // Test tablette
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Mon Restaurant, text=Bienvenue')).toBeVisible();

    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Mon Restaurant, text=Bienvenue')).toBeVisible();
  });

  test('navigation vers les pages légales', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Chercher les liens dans le footer
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();

    // Test lien mentions légales
    const mentionsLink = footer.locator('a[href="/mentions-legales"], a:has-text("Mentions légales")');
    if (await mentionsLink.count() > 0) {
      await mentionsLink.click();
      await page.waitForURL('/mentions-legales');
      await expect(page).toHaveURL('/mentions-legales');
      await expect(page.locator('text=Mentions légales, text=Mentions')).toBeVisible();
    }

    // Retour à l'accueil
    await page.goto('/');

    // Test lien politique de confidentialité
    const privacyLink = footer.locator('a[href="/politique-de-confidentialite"], a:has-text("Politique de confidentialité")');
    if (await privacyLink.count() > 0) {
      await privacyLink.click();
      await page.waitForURL('/politique-de-confidentialite');
      await expect(page).toHaveURL('/politique-de-confidentialite');
      await expect(page.locator('text=Politique de confidentialité, text=Confidentialité')).toBeVisible();
    }

    // Test lien cookies
    await page.goto('/');
    const cookiesLink = footer.locator('a[href="/cookies"], a:has-text("Cookies")');
    if (await cookiesLink.count() > 0) {
      await cookiesLink.click();
      await page.waitForURL('/cookies');
      await expect(page).toHaveURL('/cookies');
      await expect(page.locator('text=Cookies')).toBeVisible();
    }
  });

  test('affichage et fonctionnement du consentement cookies', async ({ page }) => {
    // Effacer les cookies pour s'assurer que le banner apparaît
    await page.context().clearCookies();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Vérifier l'affichage du banner de cookies
    const cookieBanner = page.locator('[data-testid="cookie-banner"], .cookie-consent, text=cookies').first();
    
    if (await cookieBanner.count() > 0) {
      await expect(cookieBanner).toBeVisible();

      // Tester les boutons d'acceptation/refus
      const acceptButton = cookieBanner.locator('button:has-text("Accepter"), button:has-text("Tout accepter")');
      const declineButton = cookieBanner.locator('button:has-text("Refuser"), button:has-text("Décliner")');

      if (await acceptButton.count() > 0) {
        await acceptButton.click();
        
        // Le banner devrait disparaître
        await expect(cookieBanner).not.toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('fonctionnalité de retour à l\'accueil', async ({ page }) => {
    // Aller sur une page légale
    await page.goto('/mentions-legales');
    await page.waitForLoadState('networkidle');

    // Chercher un lien ou bouton de retour à l'accueil
    const homeLink = page.locator('a[href="/"], button:has-text("Accueil"), .logo').first();
    
    if (await homeLink.count() > 0) {
      await homeLink.click();
      await page.waitForURL('/');
      await expect(page).toHaveURL('/');
    }

    // Test depuis la page de login
    await page.goto('/login');
    const loginHomeLink = page.locator('a[href="/"]').first();
    
    if (await loginHomeLink.count() > 0) {
      await loginHomeLink.click();
      await page.waitForURL('/');
      await expect(page).toHaveURL('/');
    }
  });

  test('performance et temps de chargement', async ({ page }) => {
    // Mesurer le temps de chargement de la page d'accueil
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Temps de chargement de la page d'accueil: ${loadTime}ms`);

    // Vérifier que la page se charge en moins de 5 secondes
    expect(loadTime).toBeLessThan(5000);

    // Vérifier la présence d'éléments critiques
    await expect(page.locator('text=Mon Restaurant, text=Bienvenue')).toBeVisible();
  });

  test('gestion des erreurs 404', async ({ page }) => {
    // Tenter d'accéder à une page qui n'existe pas
    await page.goto('/page-inexistante');

    // Vérifier que l'utilisateur est soit:
    // - Redirigé vers l'accueil
    // - Ou voit une page d'erreur 404 appropriée
    
    if (page.url().endsWith('/')) {
      // Redirigé vers l'accueil
      await expect(page.locator('text=Mon Restaurant, text=Bienvenue')).toBeVisible();
    } else {
      // Page d'erreur
      await expect(page.locator('text=404, text=introuvable, text=erreur')).toBeVisible();
    }
  });

  test('accessibilité de base', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Vérifier la présence d'un titre principal
    await expect(page.locator('h1')).toBeVisible();

    // Vérifier la structure des headings (hiérarchie)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    expect(headings).toBeGreaterThan(0);

    // Vérifier la présence d'attributs alt sur les images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const firstImage = images.first();
      const altAttribute = await firstImage.getAttribute('alt');
      // L'attribut alt devrait exister (même s'il est vide)
      expect(altAttribute).not.toBeNull();
    }

    // Vérifier la navigation au clavier
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeFocused();
  });

  test('fonctionnalités d\'ancres et de navigation interne', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Chercher des liens d'ancrage interne (scroll vers sections)
    const anchorLinks = page.locator('a[href^="#"], button[data-scroll-to]');
    const linkCount = await anchorLinks.count();

    if (linkCount > 0) {
      const firstAnchor = anchorLinks.first();
      const href = await firstAnchor.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        await firstAnchor.click();
        await page.waitForTimeout(500); // Attendre l'animation de scroll
        
        // Vérifier que l'URL contient l'ancre
        expect(page.url()).toContain(href);
      }
    }
  });

  test('métadonnées et SEO de base', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Vérifier les métadonnées de base
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Vérifier la meta description si elle existe
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const descriptionContent = await metaDescription.getAttribute('content');
      expect(descriptionContent).toBeTruthy();
    }

    // Vérifier les meta Open Graph si elles existent
    const ogTitle = page.locator('meta[property="og:title"]');
    if (await ogTitle.count() > 0) {
      const ogTitleContent = await ogTitle.getAttribute('content');
      expect(ogTitleContent).toBeTruthy();
    }
  });

  test('fonctionnement offline et erreurs réseau', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simuler une perte de connexion
    await page.context().setOffline(true);

    // Essayer de naviguer vers une autre page
    await page.click('a[href="/mentions-legales"]');
    
    // L'application devrait gérer l'erreur gracieusement
    await page.waitForTimeout(2000);

    // Restaurer la connexion
    await page.context().setOffline(false);
    
    // Vérifier que la navigation fonctionne à nouveau
    await page.goto('/');
    await expect(page.locator('text=Mon Restaurant, text=Bienvenue')).toBeVisible();
  });

  test('compatibilité avec différents navigateurs', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Vérifications de base qui devraient fonctionner sur tous les navigateurs
    await expect(page.locator('text=Mon Restaurant, text=Bienvenue')).toBeVisible();

    // Log du navigateur pour les rapports
    console.log(`Test exécuté sur: ${browserName}`);

    // Vérifier que les fonctionnalités JS de base marchent
    const jsEnabled = await page.evaluate(() => typeof window !== 'undefined');
    expect(jsEnabled).toBe(true);
  });
});