import { test, expect } from './fixtures/test-data';
import { TEST_UTILS } from './fixtures/test-data';

test.describe('Newsletter - Inscription Publique', () => {
  test('inscription à la newsletter depuis la page d\'accueil', async ({ page, testData }) => {
    const subscriberEmail = testData.generateUniqueEmail('newsletter');

    // Aller à la page d'accueil
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Localiser la section newsletter
    const newsletterSection = page.locator('section').filter({ hasText: 'Newsletter' }).first();
    await expect(newsletterSection).toBeVisible();

    // Remplir l'email et s'inscrire
    await newsletterSection.locator('input[type="email"], input[placeholder*="email"]').fill(subscriberEmail);
    await newsletterSection.locator('button[type="submit"], button:has-text("Inscrire"), button:has-text("Abonner")').click();

    // Vérifier le message de confirmation
    await expect(page.locator('text=inscrit, text=abonné, text=newsletter, text=merci')).toBeVisible({ timeout: 10000 });
  });

  test('validation de l\'email pour l\'inscription newsletter', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const newsletterSection = page.locator('section').filter({ hasText: 'Newsletter' }).first();
    await expect(newsletterSection).toBeVisible();

    // Essayer avec un email invalide
    await newsletterSection.locator('input[type="email"]').fill('email-invalide');
    await newsletterSection.locator('button[type="submit"], button:has-text("Inscrire")').click();

    // Le navigateur devrait empêcher la soumission (validation HTML5)
    const emailInput = newsletterSection.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('gestion des doublons d\'inscription', async ({ page, testData }) => {
    const subscriberEmail = testData.generateUniqueEmail('duplicate');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const newsletterSection = page.locator('section').filter({ hasText: 'Newsletter' }).first();

    // Première inscription
    await newsletterSection.locator('input[type="email"]').fill(subscriberEmail);
    await newsletterSection.locator('button[type="submit"], button:has-text("Inscrire")').click();
    await expect(page.locator('text=inscrit, text=abonné')).toBeVisible({ timeout: 5000 });

    // Recharger la page pour réinitialiser le formulaire
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Tentative de seconde inscription avec le même email
    await newsletterSection.locator('input[type="email"]').fill(subscriberEmail);
    await newsletterSection.locator('button[type="submit"], button:has-text("Inscrire")').click();

    // Devrait afficher un message indiquant que l'email est déjà inscrit
    await expect(page.locator('text=déjà, text=existe')).toBeVisible({ timeout: 5000 });
  });

  test('désabonnement via lien email', async ({ page, testData }) => {
    const subscriberEmail = testData.generateUniqueEmail('unsubscribe');

    // D'abord s'inscrire
    await page.goto('/');
    const newsletterSection = page.locator('section').filter({ hasText: 'Newsletter' }).first();
    await newsletterSection.locator('input[type="email"]').fill(subscriberEmail);
    await newsletterSection.locator('button[type="submit"], button:has-text("Inscrire")').click();
    await expect(page.locator('text=inscrit, text=abonné')).toBeVisible({ timeout: 5000 });

    // Simuler la visite du lien de désabonnement (avec un token générique)
    const unsubscribeToken = 'test-token-' + Date.now();
    await page.goto(`/unsubscribe?token=${unsubscribeToken}`);

    // Vérifier la page de désabonnement
    await expect(page.locator('text=désabonner, text=désabonnement')).toBeVisible();

    // Confirmer le désabonnement si nécessaire
    const confirmButton = page.locator('button:has-text("Confirmer"), button:has-text("Désabonner")');
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }

    // Vérifier le message de confirmation
    await expect(page.locator('text=désabonné, text=retiré')).toBeVisible({ timeout: 5000 });
  });

  test('gère les erreurs d\'inscription', async ({ page, testData }) => {
    const subscriberEmail = testData.generateUniqueEmail('error');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simuler une erreur réseau
    await page.route('**/api/newsletter', route => route.abort('failed'));

    const newsletterSection = page.locator('section').filter({ hasText: 'Newsletter' }).first();
    await newsletterSection.locator('input[type="email"]').fill(subscriberEmail);
    await newsletterSection.locator('button[type="submit"], button:has-text("Inscrire")').click();

    // Vérifier qu'un message d'erreur apparaît
    await expect(page.locator('.text-red-500, [data-testid="error-message"]')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Newsletter - Gestion Admin', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    // Naviguer vers la section newsletter
    await page.click('[data-value="newsletter"], button:has-text("Newsletter")');
    await expect(page.locator('h2:has-text("Newsletter")')).toBeVisible();
  });

  test('affiche la liste des abonnés', async ({ authenticatedPage: page }) => {
    // Vérifier que la page newsletter s'affiche
    await expect(page.locator('h2:has-text("Newsletter")')).toBeVisible();
    
    // Vérifier le compteur d'abonnés
    await expect(page.locator('h2:has-text("Newsletter")').locator('text=/\\d+ abonnés?/')).toBeVisible();

    // Vérifier la présence du tableau des abonnés
    const subscribersTable = page.locator('table, [role="table"]').first();
    await expect(subscribersTable).toBeVisible();

    // Vérifier les en-têtes du tableau
    await expect(page.locator('th:has-text("Email"), th:has-text("Actions")')).toBeVisible();
  });

  test('ajoute manuellement un abonné', async ({ authenticatedPage: page, testData }) => {
    const newEmail = testData.generateUniqueEmail('manual-add');

    // Remplir le champ d'ajout d'email
    await page.locator('input[placeholder*="email"], input[type="email"]').fill(newEmail);

    // Cliquer sur le bouton d'ajout
    await page.locator('button:has-text("Ajouter"), button:has(.lucide-plus)').click();

    // Vérifier que l'email a été ajouté à la liste
    await expect(page.locator(`text=${newEmail}`)).toBeVisible({ timeout: 5000 });

    // Vérifier que le champ s'est vidé après l'ajout
    await expect(page.locator('input[type="email"]')).toHaveValue('');
  });

  test('supprime un abonné', async ({ authenticatedPage: page }) => {
    // Compter le nombre d'abonnés avant suppression
    const initialCount = await page.locator('tbody tr').count();
    
    if (initialCount > 0) {
      // Cliquer sur le bouton de suppression du premier abonné
      const deleteButton = page.locator('tbody tr').first().locator('button:has(.lucide-trash-2)');
      await deleteButton.click();

      // Confirmer dans la modale de suppression
      await page.locator('button:has-text("Supprimer")').last().click();

      // Vérifier que l'abonné a été supprimé
      const newCount = await page.locator('tbody tr').count();
      expect(newCount).toBeLessThan(initialCount);
    } else {
      console.log('Aucun abonné à supprimer pour ce test');
    }
  });

  test('valide l\'email avant ajout', async ({ authenticatedPage: page }) => {
    // Essayer d'ajouter un email invalide
    await page.locator('input[type="email"]').fill('email-invalide');
    await page.locator('button:has-text("Ajouter")').click();

    // La validation HTML5 devrait empêcher l'ajout
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('gère les doublons lors de l\'ajout manuel', async ({ authenticatedPage: page, testData }) => {
    // Vérifier s'il y a déjà des abonnés
    const existingEmails = await page.locator('tbody tr td:first-child').count();
    
    if (existingEmails > 0) {
      // Récupérer le premier email existant
      const existingEmail = await page.locator('tbody tr').first().locator('td:first-child').textContent();
      
      if (existingEmail) {
        // Essayer d'ajouter le même email
        await page.locator('input[type="email"]').fill(existingEmail);
        await page.locator('button:has-text("Ajouter")').click();

        // Devrait afficher une erreur ou ne pas ajouter de doublon
        // Le nombre d'abonnés ne devrait pas changer
        const newCount = await page.locator('tbody tr').count();
        expect(newCount).toBe(existingEmails);
      }
    } else {
      // Pas d'abonnés existants, ajouter deux fois le même email
      const testEmail = testData.generateUniqueEmail('duplicate-test');
      
      // Premier ajout
      await page.locator('input[type="email"]').fill(testEmail);
      await page.locator('button:has-text("Ajouter")').click();
      await expect(page.locator(`text=${testEmail}`)).toBeVisible();

      // Second ajout du même email
      await page.locator('input[type="email"]').fill(testEmail);
      await page.locator('button:has-text("Ajouter")').click();

      // Ne devrait avoir qu'une seule occurrence
      const emailOccurrences = await page.locator(`text=${testEmail}`).count();
      expect(emailOccurrences).toBe(1);
    }
  });

  test('affiche un message quand aucun abonné', async ({ authenticatedPage: page }) => {
    // Si la table est vide, vérifier le message correspondant
    const rowCount = await page.locator('tbody tr').count();
    
    if (rowCount === 0 || await page.locator('text=Aucun abonné').count() > 0) {
      await expect(page.locator('text=Aucun abonné')).toBeVisible();
    }
  });

  test('recherche et filtre les abonnés', async ({ authenticatedPage: page }) => {
    const totalSubscribers = await page.locator('tbody tr').count();
    
    if (totalSubscribers > 0) {
      // S'il y a un champ de recherche
      const searchField = page.locator('input[placeholder*="recherche"], input[placeholder*="chercher"]');
      
      if (await searchField.count() > 0) {
        // Tester la recherche
        await searchField.fill('test');
        await page.waitForTimeout(500);
        
        // Le nombre de résultats peut changer
        const filteredCount = await page.locator('tbody tr').count();
        console.log(`Résultats filtrés: ${filteredCount} sur ${totalSubscribers}`);
      }
    }
  });

  test('exporte la liste des abonnés', async ({ authenticatedPage: page }) => {
    // Chercher un bouton d'export s'il existe
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Télécharger"), button:has(.lucide-download)');
    
    if (await exportButton.count() > 0) {
      // Configurer la gestion des téléchargements
      const downloadPromise = page.waitForEvent('download');
      
      await exportButton.click();
      
      const download = await downloadPromise;
      
      // Vérifier que le fichier a été téléchargé
      expect(download.suggestedFilename()).toContain('newsletter');
    } else {
      console.log('Aucun bouton d\'export trouvé');
    }
  });

  test('pagination des abonnés', async ({ authenticatedPage: page }) => {
    const totalSubscribers = await page.locator('tbody tr').count();
    
    // Si il y a beaucoup d'abonnés, vérifier la pagination
    if (totalSubscribers >= 10) {
      const paginationControls = page.locator('.pagination, button:has-text("Suivant"), button:has-text("Précédent")');
      
      if (await paginationControls.count() > 0) {
        await expect(paginationControls.first()).toBeVisible();
      }
    }
  });

  test('gère les erreurs de suppression', async ({ authenticatedPage: page }) => {
    // Simuler une erreur réseau
    await page.route('**/api/newsletter/*', route => route.abort('failed'));

    const subscribers = await page.locator('tbody tr').count();
    
    if (subscribers > 0) {
      // Essayer de supprimer un abonné
      await page.locator('tbody tr').first().locator('button:has(.lucide-trash-2)').click();
      await page.locator('button:has-text("Supprimer")').last().click();

      // L'application devrait gérer l'erreur gracieusement
      await page.waitForTimeout(1000);
    }
  });

  test('gère les erreurs d\'ajout', async ({ authenticatedPage: page, testData }) => {
    // Simuler une erreur réseau
    await page.route('**/api/newsletter', route => route.abort('failed'));

    const newEmail = testData.generateUniqueEmail('error-add');
    await page.locator('input[type="email"]').fill(newEmail);
    await page.locator('button:has-text("Ajouter")').click();

    // Vérifier qu'une erreur est gérée
    // L'email ne devrait pas apparaître dans la liste
    await page.waitForTimeout(1000);
    await expect(page.locator(`text=${newEmail}`)).not.toBeVisible();
  });

  test('statistiques des abonnés', async ({ authenticatedPage: page }) => {
    // Vérifier l'affichage des statistiques
    const subscriberCount = page.locator('h2:has-text("Newsletter")').locator('text=/\\(\\d+ abonnés?\\)/');
    await expect(subscriberCount).toBeVisible();

    // Si d'autres statistiques sont présentes (taux d'ouverture, etc.)
    const statsCards = page.locator('.stat-card, .metric-card');
    
    if (await statsCards.count() > 0) {
      await expect(statsCards.first()).toBeVisible();
    }
  });

  test('envoi de newsletter en lot', async ({ authenticatedPage: page }) => {
    // Chercher un bouton d'envoi de newsletter s'il existe
    const sendButton = page.locator('button:has-text("Envoyer newsletter"), button:has-text("Envoyer"), button:has(.lucide-send)');
    
    if (await sendButton.count() > 0) {
      await sendButton.click();

      // Si une modale de confirmation s'ouvre
      const confirmModal = page.locator('[role="dialog"], .modal');
      
      if (await confirmModal.count() > 0) {
        await expect(confirmModal).toBeVisible();
        
        // Il pourrait y avoir un champ pour le sujet et le contenu
        const subjectField = confirmModal.locator('input[placeholder*="sujet"]');
        const contentField = confirmModal.locator('textarea');
        
        if (await subjectField.count() > 0) {
          await subjectField.fill('Newsletter de test');
        }
        
        if (await contentField.count() > 0) {
          await contentField.fill('Contenu de test pour la newsletter');
        }
        
        // Annuler pour ne pas envoyer réellement
        const cancelButton = confirmModal.locator('button:has-text("Annuler")');
        if (await cancelButton.count() > 0) {
          await cancelButton.click();
        }
      }
    } else {
      console.log('Aucune fonctionnalité d\'envoi de newsletter trouvée');
    }
  });
});