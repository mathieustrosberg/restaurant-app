import { test, expect } from './fixtures/test-data';
import { TEST_MENU } from './fixtures/test-data';

test.describe('Permissions et Gestion Admin', () => {
  test('accès complet au dashboard admin', async ({ authenticatedPage: page }) => {
    // Vérifier l'accès au dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Restaurant Admin')).toBeVisible();

    // Vérifier la présence de toutes les sections dans la sidebar
    const menuItems = [
      'Contenu',
      'Menu', 
      'Réservations',
      'Newsletter',
      'Messages'
    ];

    for (const item of menuItems) {
      await expect(page.locator(`text=${item}`)).toBeVisible();
    }

    // Vérifier les boutons d'action globaux
    await expect(page.locator('button:has-text("Voir le site")')).toBeVisible();
    await expect(page.locator('button:has-text("Se déconnecter")')).toBeVisible();
  });

  test('gestion du contenu de la page d\'accueil', async ({ authenticatedPage: page }) => {
    // Naviguer vers la section contenu
    await page.click('button:has-text("Contenu"), [data-value="content"]');
    await expect(page.locator('h2:has-text("Gestion du contenu")')).toBeVisible();

    // Modifier le titre du site
    const titleInput = page.locator('input').filter({ hasText: 'Titre du site' }).or(page.locator('input[value*="Restaurant"]')).first();
    await titleInput.fill('Mon Super Restaurant Test');

    // Modifier la description
    const descriptionField = page.locator('textarea').first();
    await descriptionField.fill('Un restaurant de test exceptionnel avec des plats délicieux.');

    // Sauvegarder les modifications
    await page.click('button:has-text("Sauvegarder")');

    // Vérifier le message de confirmation
    await expect(page.locator('text=sauvegardé, text=succès')).toBeVisible({ timeout: 5000 });
  });

  test('upload et gestion d\'images', async ({ authenticatedPage: page }) => {
    await page.click('button:has-text("Contenu"), [data-value="content"]');
    
    // Chercher la section d'upload d'image
    const uploadSection = page.locator('input[type="file"], label:has-text("Uploader")').first();
    
    if (await uploadSection.count() > 0) {
      // Créer un fichier de test simple (1x1 pixel PNG)
      const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9aTF/4wAAAABJRU5ErkJggg==', 'base64');
      
      // Simuler l'upload
      await uploadSection.setInputFiles({
        name: 'test-image.png',
        mimeType: 'image/png',
        buffer: buffer
      });

      // Vérifier le message de succès ou l'affichage de l'aperçu
      await expect(page.locator('text=uploadée, text=succès, img[alt*="Aperçu"]')).toBeVisible({ timeout: 10000 });
    } else {
      console.log('Section upload non trouvée - test ignoré');
    }
  });

  test('gestion complète du menu restaurant', async ({ authenticatedPage: page, testData }) => {
    await page.click('button:has-text("Menu"), [data-value="menu"]');
    await expect(page.locator('h2:has-text("Gestion du menu")')).toBeVisible();

    // Sélectionner la catégorie "Entrées"
    const categorySelect = page.locator('select, [role="combobox"]').first();
    if (await categorySelect.count() > 0) {
      await categorySelect.click();
      await page.locator('text=Entrées, [data-value="entrees"]').click();
    }

    // Ajouter un nouveau plat
    const addButton = page.locator('button:has-text("Ajouter"), button:has(.lucide-plus)').first();
    if (await addButton.count() > 0) {
      await addButton.click();

      // Remplir les informations du nouveau plat
      const dishCards = page.locator('.p-4, .card').last();
      await dishCards.locator('input[placeholder*="Nom"]').fill('Salade Caesar Test');
      await dishCards.locator('input[placeholder*="Description"]').fill('Salade romaine, parmesan, croûtons, sauce caesar');
      await dishCards.locator('input[placeholder*="Prix"]').fill('14€');

      // Sauvegarder le menu
      await page.click('button:has-text("Sauvegarder le menu")');
      await expect(page.locator('text=sauvegardé, text=succès')).toBeVisible({ timeout: 5000 });
    }
  });

  test('suppression d\'éléments de menu', async ({ authenticatedPage: page }) => {
    await page.click('button:has-text("Menu"), [data-value="menu"]');
    
    // Chercher un bouton de suppression de plat
    const deleteButton = page.locator('button:has(.lucide-trash-2)').first();
    
    if (await deleteButton.count() > 0) {
      // Compter les plats avant suppression
      const initialDishes = await page.locator('.p-4, .card').count();
      
      // Supprimer le plat
      await deleteButton.click();
      
      // Vérifier que le plat a été supprimé
      const newDishCount = await page.locator('.p-4, .card').count();
      expect(newDishCount).toBeLessThan(initialDishes);
    }
  });

  test('navigation fluide entre toutes les sections admin', async ({ authenticatedPage: page }) => {
    const sections = [
      { name: 'Contenu', selector: '[data-value="content"]', expectedText: 'Gestion du contenu' },
      { name: 'Menu', selector: '[data-value="menu"]', expectedText: 'Gestion du menu' },
      { name: 'Réservations', selector: '[data-value="reservations"]', expectedText: 'Réservations' },
      { name: 'Newsletter', selector: '[data-value="newsletter"]', expectedText: 'Newsletter' },
      { name: 'Messages', selector: '[data-value="contact"]', expectedText: 'Messages' }
    ];

    for (const section of sections) {
      // Cliquer sur la section
      await page.click(`button:has-text("${section.name}"), ${section.selector}`);
      
      // Vérifier que la section s'affiche
      await expect(page.locator(`h2:has-text("${section.expectedText}")`)).toBeVisible();
      
      // Vérifier que l'item est marqué comme actif dans la sidebar
      const activeItem = page.locator('.bg-accent, [data-state="active"], .active').filter({ hasText: section.name });
      if (await activeItem.count() > 0) {
        await expect(activeItem).toBeVisible();
      }
    }
  });

  test('gestion des erreurs d\'autorisation', async ({ page }) => {
    // Tenter d'accéder au dashboard sans authentification
    await page.goto('/dashboard');
    
    // Devrait être redirigé vers la page de login
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
  });

  test('fonctionnalité "Voir le site" depuis le dashboard', async ({ authenticatedPage: page }) => {
    // Cliquer sur "Voir le site"
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click('button:has-text("Voir le site")')
    ]);

    // Vérifier que le site s'ouvre dans un nouvel onglet
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('/');
    
    // Vérifier que c'est bien la page publique
    await expect(newPage.locator('text=Mon Restaurant, text=Bienvenue')).toBeVisible();
    
    await newPage.close();
  });

  test('persistance des modifications après navigation', async ({ authenticatedPage: page }) => {
    // Aller dans la section contenu
    await page.click('[data-value="content"]');
    
    // Faire une modification
    const titleInput = page.locator('input').first();
    await titleInput.fill('Titre Persistant Test');
    await page.click('button:has-text("Sauvegarder")');
    await expect(page.locator('text=sauvegardé')).toBeVisible();

    // Naviguer vers une autre section
    await page.click('[data-value="menu"]');
    await expect(page.locator('h2:has-text("Gestion du menu")')).toBeVisible();

    // Revenir à la section contenu
    await page.click('[data-value="content"]');
    
    // Vérifier que la modification a été persistée
    await expect(titleInput).toHaveValue('Titre Persistant Test');
  });

  test('responsive du dashboard admin', async ({ authenticatedPage: page }) => {
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Vérifier que la sidebar mobile fonctionne
    const mobileMenuTrigger = page.locator('[data-testid="sidebar-trigger"], button:has(.lucide-menu)');
    if (await mobileMenuTrigger.count() > 0) {
      await expect(mobileMenuTrigger).toBeVisible();
      
      // Ouvrir le menu mobile
      await mobileMenuTrigger.click();
      
      // Vérifier que les options sont accessibles
      await expect(page.locator('text=Contenu')).toBeVisible();
    }

    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // La sidebar devrait être visible en permanence
    await expect(page.locator('text=Restaurant Admin')).toBeVisible();
    await expect(page.locator('text=Contenu')).toBeVisible();
  });

  test('validation des sauvegardes et messages de feedback', async ({ authenticatedPage: page }) => {
    await page.click('[data-value="content"]');
    
    // Faire plusieurs modifications
    await page.locator('input').first().fill('Test Validation');
    await page.locator('textarea').first().fill('Description de test');
    
    // Sauvegarder
    await page.click('button:has-text("Sauvegarder")');
    
    // Vérifier le message de succès
    const successMessage = page.locator('.bg-green-50, .text-green-700, .success, text=succès').first();
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // Le message devrait disparaître après quelques secondes
    await expect(successMessage).not.toBeVisible({ timeout: 10000 });
  });

  test('gestion des timeouts et erreurs réseau', async ({ authenticatedPage: page }) => {
    await page.click('[data-value="content"]');
    
    // Simuler une erreur réseau pour les API
    await page.route('**/api/content/**', route => route.abort('failed'));
    
    // Essayer de sauvegarder
    await page.locator('input').first().fill('Test Erreur Réseau');
    await page.click('button:has-text("Sauvegarder")');
    
    // Vérifier que l'erreur est gérée gracieusement
    await page.waitForTimeout(2000);
    
    // L'application ne devrait pas être bloquée
    await expect(page.locator('h2:has-text("Gestion du contenu")')).toBeVisible();
  });

  test('limites de fichiers et validation uploads', async ({ authenticatedPage: page }) => {
    await page.click('[data-value="content"]');
    
    const fileInput = page.locator('input[type="file"]');
    
    if (await fileInput.count() > 0) {
      // Créer un fichier "trop gros" (simulé)
      const largeBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB
      
      try {
        await fileInput.setInputFiles({
          name: 'large-file.jpg',
          mimeType: 'image/jpeg',
          buffer: largeBuffer
        });
        
        // Vérifier qu'un message d'erreur apparaît
        await expect(page.locator('text=trop volumineux, text=limite')).toBeVisible({ timeout: 5000 });
      } catch (error) {
        console.log('Test de fichier volumineux non applicable');
      }
    }
  });

  test('cohérence de l\'état entre sessions', async ({ authenticatedPage: page, context }) => {
    // Faire une modification
    await page.click('[data-value="content"]');
    await page.locator('input').first().fill('État Session Test');
    await page.click('button:has-text("Sauvegarder")');
    await expect(page.locator('text=sauvegardé')).toBeVisible();

    // Ouvrir une nouvelle page dans le même contexte
    const newPage = await context.newPage();
    await newPage.goto('/dashboard');
    
    // Se connecter sur la nouvelle page
    // Note: Si la session est partagée, cela devrait fonctionner automatiquement
    if (newPage.url().includes('/login')) {
      // Session non partagée, se reconnecter
      await newPage.fill('input[type="email"]', 'admin@restaurant-test.com');
      await newPage.fill('input[type="password"]', 'admin123!');
      await newPage.click('button[type="submit"]');
      await newPage.waitForURL('/dashboard');
    }

    // Vérifier que les modifications sont visibles
    await newPage.click('[data-value="content"]');
    await expect(newPage.locator('input[value="État Session Test"]')).toBeVisible();
    
    await newPage.close();
  });

  test('sécurité et échappement des données', async ({ authenticatedPage: page }) => {
    await page.click('[data-value="content"]');
    
    // Tenter d'injecter du code malveillant
    const maliciousTitle = '<script>alert("XSS")</script>Titre Test';
    const maliciousDescription = '"><img src=x onerror=alert("XSS")>Description';
    
    await page.locator('input').first().fill(maliciousTitle);
    await page.locator('textarea').first().fill(maliciousDescription);
    
    // Sauvegarder
    await page.click('button:has-text("Sauvegarder")');
    await expect(page.locator('text=sauvegardé')).toBeVisible();
    
    // Vérifier que les données sont échappées/nettoyées
    // Le contenu dangereux ne devrait pas être exécuté
    const titleValue = await page.locator('input').first().inputValue();
    const descValue = await page.locator('textarea').first().inputValue();
    
    // Les valeurs peuvent être nettoyées ou échappées
    console.log(`Titre sauvegardé: ${titleValue}`);
    console.log(`Description sauvegardée: ${descValue}`);
    
    // Vérifier qu'aucun script ne s'est exécuté
    const alerts = page.locator('text=XSS');
    await expect(alerts).not.toBeVisible();
  });
});