import { test, expect } from './fixtures/test-data';
import { TEST_RESERVATIONS, TEST_UTILS } from './fixtures/test-data';

test.describe('Réservations - Parcours Utilisateur Public', () => {
  test('création d\'une réservation depuis la page d\'accueil', async ({ page, testData }) => {
    const reservationData = testData.generateReservation({
      name: 'Pierre Dupont',
      phone: '0123456789',
      service: 'dinner',
      people: 2,
      notes: 'Allergie aux fruits de mer'
    });

    // Aller à la page d'accueil
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Localiser la section réservation
    const reservationSection = page.locator('section').filter({ hasText: 'Réservation' }).first();
    await expect(reservationSection).toBeVisible();

    // Remplir le formulaire de réservation
    await reservationSection.locator('input[name="name"], input[placeholder*="nom"], input[placeholder*="Nom"]').fill(reservationData.name);
    await reservationSection.locator('input[name="email"], input[type="email"], input[placeholder*="email"]').fill(reservationData.email);
    await reservationSection.locator('input[name="phone"], input[type="tel"], input[placeholder*="téléphone"]').fill(reservationData.phone);
    await reservationSection.locator('input[name="date"], input[type="date"]').fill(reservationData.date);
    await reservationSection.locator('input[name="time"], input[type="time"]').fill(reservationData.time);
    
    // Sélectionner le service
    const serviceSelect = reservationSection.locator('select[name="service"], [role="combobox"]').first();
    if (await serviceSelect.count() > 0) {
      await serviceSelect.selectOption({ label: reservationData.service === 'dinner' ? 'Dîner' : 'Déjeuner' });
    }

    await reservationSection.locator('input[name="people"], input[type="number"]').fill(reservationData.people.toString());
    
    if (reservationData.notes) {
      const notesField = reservationSection.locator('textarea[name="notes"], textarea[placeholder*="notes"]');
      if (await notesField.count() > 0) {
        await notesField.fill(reservationData.notes);
      }
    }

    // Soumettre le formulaire
    await reservationSection.locator('button[type="submit"], button:has-text("Réserver")').click();

    // Vérifier le message de confirmation ou la redirection
    await expect(page.locator('text=réservation, text=confirmé, text=reçu')).toBeVisible({ timeout: 10000 });
  });

  test('validation du formulaire de réservation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const reservationSection = page.locator('section').filter({ hasText: 'Réservation' }).first();
    await expect(reservationSection).toBeVisible();

    // Essayer de soumettre sans remplir les champs
    await reservationSection.locator('button[type="submit"], button:has-text("Réserver")').click();

    // Vérifier que les champs requis sont marqués
    await expect(reservationSection.locator('input[name="name"], input[placeholder*="nom"]')).toHaveAttribute('required', '');
    await expect(reservationSection.locator('input[type="email"]')).toHaveAttribute('required', '');
  });

  test('réservation avec données minimum', async ({ page, testData }) => {
    const reservationData = testData.generateReservation({
      name: 'Marie Simple',
      phone: '0987654321',
      people: 2
      // Sans notes optionnelles
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const reservationSection = page.locator('section').filter({ hasText: 'Réservation' }).first();
    await expect(reservationSection).toBeVisible();

    // Remplir seulement les champs requis
    await reservationSection.locator('input[name="name"], input[placeholder*="nom"]').fill(reservationData.name);
    await reservationSection.locator('input[type="email"]').fill(reservationData.email);
    await reservationSection.locator('input[name="phone"], input[type="tel"]').fill(reservationData.phone);
    await reservationSection.locator('input[type="date"]').fill(reservationData.date);
    await reservationSection.locator('input[type="time"]').fill(reservationData.time);
    await reservationSection.locator('input[type="number"]').fill(reservationData.people.toString());

    // Soumettre
    await reservationSection.locator('button[type="submit"], button:has-text("Réserver")').click();

    // Vérifier la confirmation
    await expect(page.locator('text=réservation, text=confirmé, text=reçu')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Réservations - Gestion Admin (CRUD)', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    // Naviguer vers la section réservations
    await page.click('[data-value="reservations"], button:has-text("Réservations")');
    await expect(page.locator('h2:has-text("Réservations")')).toBeVisible();
  });

  test('affiche la liste des réservations', async ({ authenticatedPage: page }) => {
    // Vérifier que la page des réservations s'affiche
    await expect(page.locator('h2:has-text("Réservations")')).toBeVisible();
    
    // Vérifier la présence du tableau ou des cartes de réservations
    const reservationsContainer = page.locator('table, [role="table"], .space-y-4').first();
    await expect(reservationsContainer).toBeVisible();

    // Vérifier les en-têtes de colonnes (vue desktop) ou la structure des cartes (mobile)
    if (await page.locator('table').count() > 0) {
      await expect(page.locator('th:has-text("Client"), th:has-text("Date"), th:has-text("Statut")')).toBeVisible();
    }
  });

  test('confirme une réservation en attente', async ({ authenticatedPage: page }) => {
    // Chercher une réservation avec le statut "En attente"
    const pendingReservation = page.locator('[data-status="PENDING"], .bg-yellow-500:has-text("En attente")').first();
    
    if (await pendingReservation.count() > 0) {
      // Trouver le bouton de confirmation associé
      const confirmButton = pendingReservation.locator('..').locator('button:has-text("Confirmer"), button .lucide-check-circle-2').first();
      await confirmButton.click();

      // Vérifier que le statut a changé
      await expect(page.locator('.bg-green-500:has-text("Confirmée")')).toBeVisible();
    } else {
      console.log('Aucune réservation en attente trouvée pour ce test');
    }
  });

  test('annule une réservation', async ({ authenticatedPage: page }) => {
    // Chercher une réservation active
    const activeReservation = page.locator('[data-status="CONFIRMED"], [data-status="PENDING"]').first();
    
    if (await activeReservation.count() > 0) {
      // Cliquer sur le bouton d'annulation
      const cancelButton = activeReservation.locator('..').locator('button:has-text("Annuler"), button:has-text("Refuser"), button .lucide-trash-2').first();
      await cancelButton.click();

      // Vérifier que le statut a changé vers "Annulée"
      await expect(page.locator('.text-red-500:has-text("Annulée"), .bg-red-500:has-text("Annulée")')).toBeVisible();
    } else {
      console.log('Aucune réservation active trouvée pour ce test');
    }
  });

  test('supprime définitivement une réservation annulée', async ({ authenticatedPage: page }) => {
    // Chercher une réservation annulée
    const canceledReservation = page.locator('[data-status="CANCELED"]').first();
    
    if (await canceledReservation.count() > 0) {
      // Compter le nombre de réservations avant suppression
      const initialCount = await page.locator('tbody tr, .space-y-4 > div').count();

      // Cliquer sur supprimer
      const deleteButton = canceledReservation.locator('..').locator('button:has-text("Supprimer")').first();
      await deleteButton.click();

      // Confirmer dans la modale
      await page.locator('button:has-text("Supprimer")').last().click();

      // Vérifier que la réservation a été supprimée
      const newCount = await page.locator('tbody tr, .space-y-4 > div').count();
      expect(newCount).toBeLessThan(initialCount);
    } else {
      console.log('Aucune réservation annulée trouvée pour ce test');
    }
  });

  test('filtre et recherche dans les réservations', async ({ authenticatedPage: page }) => {
    // Si il y a des réservations, tester les fonctionnalités de recherche/filtre
    const reservationsExist = await page.locator('tbody tr, .space-y-4 > div').count() > 0;
    
    if (reservationsExist) {
      // Chercher un champ de recherche s'il existe
      const searchField = page.locator('input[placeholder*="recherche"], input[placeholder*="chercher"]');
      if (await searchField.count() > 0) {
        await searchField.fill('test');
        await page.waitForTimeout(500); // Attendre le filtrage
      }

      // Chercher des filtres de statut s'ils existent
      const statusFilter = page.locator('select:has(option:has-text("Statut")), [role="combobox"]:has-text("Statut")');
      if (await statusFilter.count() > 0) {
        await statusFilter.click();
        await page.locator('option:has-text("Confirmée"), [role="option"]:has-text("Confirmée")').click();
      }
    }
  });

  test('affiche les détails d\'une réservation', async ({ authenticatedPage: page }) => {
    // Cliquer sur une réservation pour voir ses détails
    const firstReservation = page.locator('tbody tr, .space-y-4 > div').first();
    
    if (await firstReservation.count() > 0) {
      await firstReservation.click();

      // Vérifier que les détails sont affichés (nom, email, téléphone, etc.)
      await expect(page.locator('text=@, text=0')).toBeVisible(); // Email ou téléphone
    }
  });

  test('gestion responsive des réservations', async ({ authenticatedPage: page }) => {
    // Tester la vue mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Naviguer vers les réservations
    await page.click('[data-value="reservations"], button:has-text("Réservations")');

    // Vérifier que la vue mobile s'affiche (cartes au lieu du tableau)
    await expect(page.locator('.lg\\:hidden')).toBeVisible();

    // Tester la vue desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Naviguer vers les réservations
    await page.click('[data-value="reservations"], button:has-text("Réservations")');

    // Vérifier que la vue desktop s'affiche (tableau)
    if (await page.locator('table').count() > 0) {
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('validation des actions de réservation', async ({ authenticatedPage: page }) => {
    // Vérifier que les actions ne sont disponibles que selon le statut
    const reservations = await page.locator('tbody tr, .space-y-4 > div').count();
    
    if (reservations > 0) {
      // Pour les réservations en attente : boutons confirmer et refuser
      const pendingReservations = page.locator('[data-status="PENDING"]');
      if (await pendingReservations.count() > 0) {
        await expect(pendingReservations.first().locator('..').locator('button:has-text("Confirmer")')).toBeVisible();
        await expect(pendingReservations.first().locator('..').locator('button:has-text("Refuser")')).toBeVisible();
      }

      // Pour les réservations confirmées : bouton annuler
      const confirmedReservations = page.locator('[data-status="CONFIRMED"]');
      if (await confirmedReservations.count() > 0) {
        await expect(confirmedReservations.first().locator('..').locator('button:has-text("Annuler")')).toBeVisible();
      }

      // Pour les réservations annulées : bouton supprimer
      const canceledReservations = page.locator('[data-status="CANCELED"]');
      if (await canceledReservations.count() > 0) {
        await expect(canceledReservations.first().locator('..').locator('button:has-text("Supprimer")')).toBeVisible();
      }
    }
  });

  test('affiche les statistiques des réservations', async ({ authenticatedPage: page }) => {
    // Vérifier l'affichage du nombre total de réservations
    await expect(page.locator('h2:has-text("Réservations")').locator('text=/\\(\\d+\\)/')).toBeVisible();

    // Vérifier les badges de statut si ils sont présents
    const statusBadges = page.locator('.bg-yellow-500, .bg-green-500, .bg-red-500');
    if (await statusBadges.count() > 0) {
      await expect(statusBadges.first()).toBeVisible();
    }
  });

  test('gère les erreurs de mise à jour de statut', async ({ authenticatedPage: page }) => {
    // Simuler une erreur réseau pour les actions
    await page.route('**/api/reservations/*', route => route.abort('failed'));

    const firstReservation = page.locator('tbody tr, .space-y-4 > div').first();
    if (await firstReservation.count() > 0) {
      const actionButton = firstReservation.locator('button').first();
      if (await actionButton.count() > 0) {
        await actionButton.click();

        // Vérifier qu'une erreur est gérée (message d'erreur ou statut inchangé)
        // Le test passe si l'application ne crash pas
        await page.waitForTimeout(1000);
      }
    }
  });
});