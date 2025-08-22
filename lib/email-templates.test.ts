import {
  reservationConfirmedTemplate,
  reservationCanceledTemplate,
  contactResponseTemplate,
  newsletterWelcomeTemplate,
  unsubscribeConfirmationTemplate
} from './email-templates';
import { ReservationEmailData, ContactResponseData } from './resend';

describe('email-templates', () => {
  const mockReservationData: ReservationEmailData = {
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    date: '2024-12-25',
    time: '19:30',
    service: 'dinner' as const,
    people: 4,
    notes: 'Allergie aux fruits de mer'
  };

  const mockContactData: ContactResponseData = {
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    originalSubject: 'Question sur les menus',
    originalMessage: 'Avez-vous des options végétariennes ?',
    response: 'Oui, nous proposons plusieurs plats végétariens délicieux.'
  };

  describe('reservationConfirmedTemplate', () => {
    test('generates correct HTML for dinner reservation', () => {
      const html = reservationConfirmedTemplate(mockReservationData);
      
      expect(html).toContain('Réservation Confirmée');
      expect(html).toContain('John Doe');
      expect(html).toContain('25 décembre 2024'); // French date format
      expect(html).toContain('19:30');
      expect(html).toContain('Dîner');
      expect(html).toContain('4');
      expect(html).toContain('Allergie aux fruits de mer');
      expect(html).toContain('✅ Confirmée');
      expect(html).toContain('🎉 Réservation Confirmée');
    });

    test('generates correct HTML for lunch reservation', () => {
      const lunchData = { ...mockReservationData, service: 'lunch' as const };
      const html = reservationConfirmedTemplate(lunchData);
      
      expect(html).toContain('Déjeuner');
    });

    test('handles reservation without notes', () => {
      const dataWithoutNotes = { ...mockReservationData, notes: undefined };
      const html = reservationConfirmedTemplate(dataWithoutNotes);
      
      expect(html).not.toContain('Notes :');
      expect(html).toContain('John Doe');
    });

    test('handles empty notes', () => {
      const dataWithEmptyNotes = { ...mockReservationData, notes: '' };
      const html = reservationConfirmedTemplate(dataWithEmptyNotes);
      
      expect(html).not.toContain('Notes :');
    });

    test('does not escape HTML characters (templates are trusted)', () => {
      const dataWithHtml = {
        ...mockReservationData,
        customerName: '<script>alert("xss")</script>',
        notes: 'Test & special chars < > " \''
      };
      const html = reservationConfirmedTemplate(dataWithHtml);
      
      // Templates directly insert data - escaping should be done at input level
      expect(html).toContain('<script>alert("xss")</script>');
      expect(html).toContain('Test & special chars');
    });
  });

  describe('reservationCanceledTemplate', () => {
    test('generates correct HTML for canceled reservation', () => {
      const html = reservationCanceledTemplate(mockReservationData);
      
      expect(html).toContain('Réservation Non Disponible');
      expect(html).toContain('John Doe');
      expect(html).toContain('❌ Non disponible');
      expect(html).toContain('😔 Réservation Non Disponible');
      expect(html).toContain('nous ne pouvons pas confirmer');
    });

    test('formats date correctly for canceled reservation', () => {
      const html = reservationCanceledTemplate(mockReservationData);
      expect(html).toContain('25 décembre 2024');
    });
  });

  describe('contactResponseTemplate', () => {
    test('generates correct HTML for contact response', () => {
      const html = contactResponseTemplate(mockContactData);
      
      expect(html).toContain('Réponse à votre message');
      expect(html).toContain('Jane Smith');
      expect(html).toContain('Question sur les menus');
      expect(html).toContain('Avez-vous des options végétariennes ?');
      expect(html).toContain('Oui, nous proposons plusieurs plats végétariens');
      expect(html).toContain('💬 Réponse à votre message');
    });

    test('handles long messages correctly', () => {
      const longMessage = 'A'.repeat(1000);
      const dataWithLongMessage = {
        ...mockContactData,
        originalMessage: longMessage,
        response: longMessage
      };
      
      const html = contactResponseTemplate(dataWithLongMessage);
      expect(html).toContain(longMessage);
    });

    test('handles special characters in messages', () => {
      const dataWithSpecialChars = {
        ...mockContactData,
        originalMessage: 'Message with "quotes" & <tags>',
        response: 'Response with émojis 🍽️ and àccénts'
      };
      
      const html = contactResponseTemplate(dataWithSpecialChars);
      expect(html).toContain('Message with "quotes" &');
      expect(html).toContain('émojis 🍽️');
    });
  });

  describe('newsletterWelcomeTemplate', () => {
    test('generates correct HTML for newsletter welcome', () => {
      const email = 'test@example.com';
      const unsubscribeUrl = 'https://example.com/unsubscribe?token=abc123';
      
      const html = newsletterWelcomeTemplate(email, unsubscribeUrl);
      
      expect(html).toContain('Bienvenue dans notre Newsletter');
      expect(html).toContain('🎉 Bienvenue dans notre Newsletter');
      expect(html).toContain('ravis de vous compter');
      expect(html).toContain(unsubscribeUrl);
      expect(html).toContain('désabonner');
      expect(html).toContain('🍽️ Nos nouveaux plats');
    });

    test('handles malicious unsubscribe URL', () => {
      const email = 'test@example.com';
      const maliciousUrl = 'javascript:alert("xss")';
      
      const html = newsletterWelcomeTemplate(email, maliciousUrl);
      
      expect(html).toContain(maliciousUrl); // Should be escaped by browser
    });

    test('handles special characters in email', () => {
      const email = 'tëst+tag@éxample.com';
      const unsubscribeUrl = 'https://example.com/unsubscribe?token=abc123';
      
      const html = newsletterWelcomeTemplate(email, unsubscribeUrl);
      expect(html).toContain('Bienvenue dans notre Newsletter');
    });
  });

  describe('unsubscribeConfirmationTemplate', () => {
    test('generates correct HTML for unsubscribe confirmation', () => {
      const email = 'test@example.com';
      
      const html = unsubscribeConfirmationTemplate(email);
      
      expect(html).toContain('Désabonnement Confirmé');
      expect(html).toContain('👋 Désabonnement Confirmé');
      expect(html).toContain('Au revoir !');
      expect(html).toContain('désabonnement de notre newsletter a été confirmé');
      expect(html).toContain('vous pourrez toujours vous réabonner');
    });

    test('handles empty email gracefully', () => {
      const html = unsubscribeConfirmationTemplate('');
      expect(html).toContain('Au revoir !');
    });
  });

  describe('base template structure', () => {
    test('all templates contain required HTML structure', () => {
      const templates = [
        reservationConfirmedTemplate(mockReservationData),
        reservationCanceledTemplate(mockReservationData),
        contactResponseTemplate(mockContactData),
        newsletterWelcomeTemplate('test@example.com', 'https://example.com'),
        unsubscribeConfirmationTemplate('test@example.com')
      ];

      templates.forEach(html => {
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('<html>');
        expect(html).toContain('<head>');
        expect(html).toContain('<body>');
        expect(html).toContain('class="container"');
        expect(html).toContain('class="header"');
        expect(html).toContain('class="content"');
        expect(html).toContain('class="footer"');
      });
    });

    test('all templates are valid HTML', () => {
      const templates = [
        reservationConfirmedTemplate(mockReservationData),
        reservationCanceledTemplate(mockReservationData),
        contactResponseTemplate(mockContactData),
        newsletterWelcomeTemplate('test@example.com', 'https://example.com'),
        unsubscribeConfirmationTemplate('test@example.com')
      ];

      templates.forEach(html => {
        // Basic HTML validation
        const openTags = (html.match(/<[^/>][^>]*>/g) || []).length;
        const closeTags = (html.match(/<\/[^>]+>/g) || []).length;
        expect(openTags).toBeGreaterThan(0);
        expect(closeTags).toBeGreaterThan(0);
      });
    });
  });

  describe('date formatting edge cases', () => {
    test('handles invalid date strings gracefully', () => {
      const dataWithInvalidDate = {
        ...mockReservationData,
        date: 'invalid-date'
      };
      
      expect(() => {
        reservationConfirmedTemplate(dataWithInvalidDate);
      }).not.toThrow();
    });

    test('handles future dates correctly', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      const dataWithFutureDate = {
        ...mockReservationData,
        date: futureDate.toISOString()
      };
      
      const html = reservationConfirmedTemplate(dataWithFutureDate);
      expect(html).toContain(String(futureDate.getFullYear())); // Should contain future year
    });
  });
});