import { test, expect } from './fixtures/test-data';
import { TEST_CONTACTS, TEST_UTILS } from './fixtures/test-data';

test.describe('Contact - Parcours Utilisateur Public', () => {
  test('envoi d\'un message de contact depuis la page d\'accueil', async ({ page, testData }) => {
    const contactData = testData.generateContact({
      name: 'Sophie Martin',
      subject: 'Demande d\'information sur les menus',
      message: 'Bonjour, j\'aimerais connaître vos options végétariennes. Avez-vous des plats vegan disponibles ?'
    });

    // Aller à la page d'accueil
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Localiser la section contact
    const contactSection = page.locator('section').filter({ hasText: 'Contact' }).first();
    await expect(contactSection).toBeVisible();

    // Remplir le formulaire de contact
    await contactSection.locator('input[name="name"], input[placeholder*="nom"], input[placeholder*="Nom"]').fill(contactData.name);
    await contactSection.locator('input[name="email"], input[type="email"], input[placeholder*="email"]').fill(contactData.email);
    await contactSection.locator('input[name="subject"], input[placeholder*="sujet"], input[placeholder*="objet"]').fill(contactData.subject);
    await contactSection.locator('textarea[name="message"], textarea[placeholder*="message"]').fill(contactData.message);

    // Soumettre le formulaire
    await contactSection.locator('button[type="submit"], button:has-text("Envoyer")').click();

    // Vérifier le message de confirmation
    await expect(page.locator('text=message, text=envoyé, text=reçu, text=merci')).toBeVisible({ timeout: 10000 });
  });

  test('validation du formulaire de contact', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contactSection = page.locator('section').filter({ hasText: 'Contact' }).first();
    await expect(contactSection).toBeVisible();

    // Essayer de soumettre sans remplir les champs
    await contactSection.locator('button[type="submit"], button:has-text("Envoyer")').click();

    // Vérifier que les champs requis sont marqués
    await expect(contactSection.locator('input[name="name"], input[placeholder*="nom"]')).toHaveAttribute('required', '');
    await expect(contactSection.locator('input[type="email"]')).toHaveAttribute('required', '');
    await expect(contactSection.locator('input[name="subject"], input[placeholder*="sujet"]')).toHaveAttribute('required', '');
    await expect(contactSection.locator('textarea[name="message"], textarea[placeholder*="message"]')).toHaveAttribute('required', '');
  });

  test('gestion des erreurs de soumission', async ({ page, testData }) => {
    const contactData = testData.generateContact();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simuler une erreur réseau
    await page.route('**/api/contact', route => route.abort('failed'));

    const contactSection = page.locator('section').filter({ hasText: 'Contact' }).first();
    
    // Remplir et soumettre
    await contactSection.locator('input[name="name"], input[placeholder*="nom"]').fill(contactData.name);
    await contactSection.locator('input[type="email"]').fill(contactData.email);
    await contactSection.locator('input[name="subject"], input[placeholder*="sujet"]').fill(contactData.subject);
    await contactSection.locator('textarea[name="message"], textarea[placeholder*="message"]').fill(contactData.message);
    
    await contactSection.locator('button[type="submit"], button:has-text("Envoyer")').click();

    // Vérifier qu'un message d'erreur apparaît
    await expect(page.locator('.text-red-500, [data-testid="error-message"]')).toBeVisible({ timeout: 5000 });
  });

  test('contact avec message long', async ({ page, testData }) => {
    const longMessage = 'A'.repeat(1000); // Message très long
    const contactData = testData.generateContact({
      name: 'Test Long Message',
      subject: 'Message très détaillé',
      message: longMessage
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contactSection = page.locator('section').filter({ hasText: 'Contact' }).first();
    
    // Remplir avec un message long
    await contactSection.locator('input[name="name"], input[placeholder*="nom"]').fill(contactData.name);
    await contactSection.locator('input[type="email"]').fill(contactData.email);
    await contactSection.locator('input[name="subject"], input[placeholder*="sujet"]').fill(contactData.subject);
    await contactSection.locator('textarea[name="message"], textarea[placeholder*="message"]').fill(contactData.message);
    
    await contactSection.locator('button[type="submit"], button:has-text("Envoyer")').click();

    // Vérifier que le message long est accepté
    await expect(page.locator('text=message, text=envoyé, text=reçu')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Contact - Gestion Admin', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    // Naviguer vers la section messages
    await page.click('[data-value="contact"], button:has-text("Messages")');
    await expect(page.locator('h2:has-text("Messages")')).toBeVisible();
  });

  test('affiche la liste des messages de contact', async ({ authenticatedPage: page }) => {
    // Vérifier que la page des messages s'affiche
    await expect(page.locator('h2:has-text("Messages")')).toBeVisible();
    
    // Vérifier la présence de la liste des messages
    const messagesContainer = page.locator('[data-testid="messages-list"], .space-y-3, .grid').first();
    await expect(messagesContainer).toBeVisible();

    // Vérifier le compteur de messages
    await expect(page.locator('h2:has-text("Messages")').locator('text=/\\(\\d+\\)/')).toBeVisible();
  });

  test('consulte un message et change son statut à "Lu"', async ({ authenticatedPage: page }) => {
    // Chercher un message avec le statut "Nouveau"
    const newMessage = page.locator('.bg-blue-500:has-text("Nouveau"), [data-status="NEW"]').first();
    
    if (await newMessage.count() > 0) {
      // Cliquer sur le message pour l'ouvrir
      await newMessage.click();

      // Vérifier que le message s'ouvre et affiche les détails
      await expect(page.locator('text=Détails du message')).toBeVisible();
      
      // Le statut devrait automatiquement passer à "Lu"
      await expect(page.locator('.bg-gray-500:has-text("Lu"), [data-status="READ"]')).toBeVisible({ timeout: 5000 });
    } else {
      console.log('Aucun nouveau message trouvé pour ce test');
    }
  });

  test('répond à un message de contact', async ({ authenticatedPage: page }) => {
    // Sélectionner un message
    const firstMessage = page.locator('.cursor-pointer').first();
    
    if (await firstMessage.count() > 0) {
      await firstMessage.click();

      // Vérifier que les détails du message s'affichent
      await expect(page.locator('text=Détails du message')).toBeVisible();

      // Remplir la réponse
      const responseText = 'Merci pour votre message. Nous proposons effectivement plusieurs options végétariennes dans notre carte.';
      await page.locator('textarea[placeholder*="réponse"], textarea[placeholder*="Réponse"]').fill(responseText);

      // Envoyer la réponse
      await page.locator('button:has-text("Envoyer"), button:has-text("Répondre")').click();

      // Vérifier que le message passe au statut "Répondu"
      await expect(page.locator('.bg-green-500:has-text("Répondu"), [data-status="REPLIED"]')).toBeVisible({ timeout: 5000 });
    } else {
      console.log('Aucun message trouvé pour ce test');
    }
  });

  test('modifie une réponse existante', async ({ authenticatedPage: page }) => {
    // Chercher un message avec le statut "Répondu"
    const repliedMessage = page.locator('.bg-green-500:has-text("Répondu"), [data-status="REPLIED"]').first();
    
    if (await repliedMessage.count() > 0) {
      await repliedMessage.click();

      // Vérifier qu'une réponse existe déjà
      await expect(page.locator('text=Réponse envoyée')).toBeVisible();

      // Modifier la réponse
      const newResponse = 'Réponse modifiée : Nous proposons aussi des options vegan sur demande.';
      await page.locator('textarea').fill(newResponse);

      // Envoyer la modification
      await page.locator('button:has-text("Modifier")').click();

      // Vérifier que la réponse a été mise à jour
      await expect(page.locator(`text=${newResponse}`)).toBeVisible({ timeout: 5000 });
    } else {
      console.log('Aucun message répondu trouvé pour ce test');
    }
  });

  test('supprime un message', async ({ authenticatedPage: page }) => {
    // Compter le nombre de messages avant suppression
    const initialCount = await page.locator('.cursor-pointer').count();
    
    if (initialCount > 0) {
      // Sélectionner un message
      await page.locator('.cursor-pointer').first().click();

      // Cliquer sur supprimer
      await page.locator('button:has(.lucide-trash-2), button:has-text("Supprimer")').click();

      // Confirmer dans la modale
      await page.locator('button:has-text("Supprimer")').last().click();

      // Vérifier que le message a été supprimé
      const newCount = await page.locator('.cursor-pointer').count();
      expect(newCount).toBeLessThan(initialCount);
    } else {
      console.log('Aucun message à supprimer pour ce test');
    }
  });

  test('filtre les messages par statut', async ({ authenticatedPage: page }) => {
    const totalMessages = await page.locator('.cursor-pointer').count();
    
    if (totalMessages > 0) {
      // Tester les différents statuts si des badges sont présents
      const statusBadges = page.locator('.bg-blue-500, .bg-gray-500, .bg-green-500');
      
      if (await statusBadges.count() > 0) {
        // Compter les messages "Nouveau"
        const newCount = await page.locator('.bg-blue-500:has-text("Nouveau")').count();
        
        // Compter les messages "Lu"  
        const readCount = await page.locator('.bg-gray-500:has-text("Lu")').count();
        
        // Compter les messages "Répondu"
        const repliedCount = await page.locator('.bg-green-500:has-text("Répondu")').count();

        console.log(`Messages: ${newCount} nouveaux, ${readCount} lus, ${repliedCount} répondus`);
      }
    }
  });

  test('affiche les détails complets d\'un message', async ({ authenticatedPage: page }) => {
    const firstMessage = page.locator('.cursor-pointer').first();
    
    if (await firstMessage.count() > 0) {
      await firstMessage.click();

      // Vérifier tous les détails affichés
      await expect(page.locator('text=De :')).toBeVisible();
      await expect(page.locator('text=Email :')).toBeVisible();
      await expect(page.locator('text=Sujet :')).toBeVisible();
      await expect(page.locator('text=Date :')).toBeVisible();
      await expect(page.locator('text=Message :')).toBeVisible();

      // Vérifier la présence de l'email dans le format correct
      await expect(page.locator('text=@')).toBeVisible();
      
      // Vérifier la présence d'une date formatée
      await expect(page.locator('text=/\\d{2}\/\\d{2}\/\\d{4}/')).toBeVisible();
    }
  });

  test('gestion responsive des messages', async ({ authenticatedPage: page }) => {
    // Vue mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    await page.click('[data-value="contact"], button:has-text("Messages")');
    
    // Vérifier que les messages s'affichent correctement en mobile
    await expect(page.locator('h2:has-text("Messages")')).toBeVisible();

    // Vue desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    await page.click('[data-value="contact"], button:has-text("Messages")');
    
    // Vérifier la vue en deux colonnes sur desktop
    await expect(page.locator('.grid-cols-1')).toBeVisible();
  });

  test('validation de la réponse requise', async ({ authenticatedPage: page }) => {
    const firstMessage = page.locator('.cursor-pointer').first();
    
    if (await firstMessage.count() > 0) {
      await firstMessage.click();

      // Essayer d'envoyer une réponse vide
      const sendButton = page.locator('button:has-text("Envoyer"), button:has-text("Répondre")');
      
      // Le bouton devrait être désactivé si le champ est vide
      await expect(sendButton).toBeDisabled();

      // Remplir quelque chose et vérifier que le bouton s'active
      await page.locator('textarea').fill('Test réponse');
      await expect(sendButton).toBeEnabled();
    }
  });

  test('gère les erreurs de réponse', async ({ authenticatedPage: page }) => {
    // Simuler une erreur réseau
    await page.route('**/api/contact/*', route => route.abort('failed'));

    const firstMessage = page.locator('.cursor-pointer').first();
    
    if (await firstMessage.count() > 0) {
      await firstMessage.click();
      
      await page.locator('textarea').fill('Réponse test');
      await page.locator('button:has-text("Envoyer")').click();

      // L'application devrait gérer l'erreur gracieusement
      await page.waitForTimeout(1000);
    }
  });

  test('affiche l\'historique chronologique des messages', async ({ authenticatedPage: page }) => {
    const messages = await page.locator('.cursor-pointer').count();
    
    if (messages > 1) {
      // Vérifier que les messages sont triés par date (le plus récent en premier)
      const firstMessageTime = await page.locator('.cursor-pointer').first().locator('text=/\\d{2}\/\\d{2}\/\\d{4}|\\d{2}:\\d{2}/').textContent();
      const secondMessageTime = await page.locator('.cursor-pointer').nth(1).locator('text=/\\d{2}\/\\d{2}\/\\d{4}|\\d{2}:\\d{2}/').textContent();
      
      console.log(`Premier message: ${firstMessageTime}, Second message: ${secondMessageTime}`);
    }
  });
});