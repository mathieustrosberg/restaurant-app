import {
  sendReservationEmail,
  sendContactResponseEmail,
  sendNewsletterWelcomeEmail,
  sendUnsubscribeConfirmationEmail,
  generateUnsubscribeToken
} from './email-service';

// Mock the resend module
jest.mock('./resend', () => ({
  resend: {
    emails: {
      send: jest.fn()
    }
  },
  EMAIL_CONFIG: {
    from: 'test@restaurant.com',
    replyTo: 'contact@restaurant.com'
  }
}));

// Mock the email templates
jest.mock('./email-templates', () => ({
  reservationConfirmedTemplate: jest.fn(() => '<html>Confirmed template</html>'),
  reservationCanceledTemplate: jest.fn(() => '<html>Canceled template</html>'),
  contactResponseTemplate: jest.fn(() => '<html>Contact response template</html>'),
  newsletterWelcomeTemplate: jest.fn(() => '<html>Newsletter welcome template</html>'),
  unsubscribeConfirmationTemplate: jest.fn(() => '<html>Unsubscribe template</html>')
}));

// Mock process.env
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_BASE_URL: 'https://test-restaurant.com'
  };
  jest.clearAllMocks();
});

afterEach(() => {
  process.env = originalEnv;
});

describe('email-service', () => {
  const { resend } = require('./resend');
  const mockEmailTemplates = require('./email-templates');

  const mockReservationData = {
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    date: '2024-12-25',
    time: '19:30',
    service: 'dinner' as const,
    people: 4,
    notes: 'Allergie aux fruits de mer'
  };

  const mockContactData = {
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    originalSubject: 'Question sur les menus',
    originalMessage: 'Avez-vous des options végétariennes ?',
    response: 'Oui, nous proposons plusieurs plats végétariens.'
  };

  describe('sendReservationEmail', () => {
    test('sends confirmed reservation email successfully', async () => {
      resend.emails.send.mockResolvedValue({
        data: { id: 'email-123' }
      });

      const result = await sendReservationEmail('CONFIRMED', mockReservationData);

      expect(result).toEqual({
        success: true,
        messageId: 'email-123'
      });

      expect(resend.emails.send).toHaveBeenCalledWith({
        from: 'test@restaurant.com',
        to: ['john@example.com'],
        subject: '✅ Réservation confirmée - Restaurant',
        html: '<html>Confirmed template</html>',
        replyTo: 'contact@restaurant.com'
      });

      expect(mockEmailTemplates.reservationConfirmedTemplate).toHaveBeenCalledWith(mockReservationData);
    });

    test('sends canceled reservation email successfully', async () => {
      resend.emails.send.mockResolvedValue({
        data: { id: 'email-456' }
      });

      const result = await sendReservationEmail('CANCELED', mockReservationData);

      expect(result).toEqual({
        success: true,
        messageId: 'email-456'
      });

      expect(resend.emails.send).toHaveBeenCalledWith({
        from: 'test@restaurant.com',
        to: ['john@example.com'],
        subject: '❌ Réservation non disponible - Restaurant',
        html: '<html>Canceled template</html>',
        replyTo: 'contact@restaurant.com'
      });

      expect(mockEmailTemplates.reservationCanceledTemplate).toHaveBeenCalledWith(mockReservationData);
    });

    test('handles email sending error', async () => {
      const error = new Error('SMTP connection failed');
      resend.emails.send.mockRejectedValue(error);

      const result = await sendReservationEmail('CONFIRMED', mockReservationData);

      expect(result).toEqual({
        success: false,
        error: 'SMTP connection failed'
      });
    });

    test('handles non-Error exceptions', async () => {
      resend.emails.send.mockRejectedValue('String error');

      const result = await sendReservationEmail('CONFIRMED', mockReservationData);

      expect(result).toEqual({
        success: false,
        error: 'Erreur inconnue'
      });
    });

    test('handles missing customer email', async () => {
      const dataWithoutEmail = { ...mockReservationData, customerEmail: '' };
      resend.emails.send.mockResolvedValue({ data: { id: 'email-123' } });

      const result = await sendReservationEmail('CONFIRMED', dataWithoutEmail);

      expect(resend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ['']
        })
      );
    });
  });

  describe('sendContactResponseEmail', () => {
    test('sends contact response email successfully', async () => {
      resend.emails.send.mockResolvedValue({
        data: { id: 'contact-123' }
      });

      const result = await sendContactResponseEmail(mockContactData);

      expect(result).toEqual({
        success: true,
        messageId: 'contact-123'
      });

      expect(resend.emails.send).toHaveBeenCalledWith({
        from: 'test@restaurant.com',
        to: ['jane@example.com'],
        subject: 'Re: Question sur les menus',
        html: '<html>Contact response template</html>',
        replyTo: 'contact@restaurant.com'
      });

      expect(mockEmailTemplates.contactResponseTemplate).toHaveBeenCalledWith(mockContactData);
    });

    test('handles email sending error', async () => {
      const error = new Error('Invalid email address');
      resend.emails.send.mockRejectedValue(error);

      const result = await sendContactResponseEmail(mockContactData);

      expect(result).toEqual({
        success: false,
        error: 'Invalid email address'
      });
    });

    test('handles special characters in subject', async () => {
      const dataWithSpecialSubject = {
        ...mockContactData,
        originalSubject: 'Réservation & Menu spéciaux 🍽️'
      };
      resend.emails.send.mockResolvedValue({ data: { id: 'contact-123' } });

      await sendContactResponseEmail(dataWithSpecialSubject);

      expect(resend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Re: Réservation & Menu spéciaux 🍽️'
        })
      );
    });
  });

  describe('sendNewsletterWelcomeEmail', () => {
    test('sends newsletter welcome email successfully', async () => {
      resend.emails.send.mockResolvedValue({
        data: { id: 'newsletter-123' }
      });

      const result = await sendNewsletterWelcomeEmail('test@example.com', 'token123');

      expect(result).toEqual({
        success: true,
        messageId: 'newsletter-123'
      });

      expect(resend.emails.send).toHaveBeenCalledWith({
        from: 'test@restaurant.com',
        to: ['test@example.com'],
        subject: '🎉 Bienvenue dans notre newsletter !',
        html: '<html>Newsletter welcome template</html>',
        replyTo: 'contact@restaurant.com',
        headers: {
          'List-Unsubscribe': '<https://test-restaurant.com/unsubscribe?token=token123>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
      });

      expect(mockEmailTemplates.newsletterWelcomeTemplate).toHaveBeenCalledWith(
        'test@example.com',
        'https://test-restaurant.com/unsubscribe?token=token123'
      );
    });

    test('uses localhost when NEXT_PUBLIC_BASE_URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_BASE_URL;
      resend.emails.send.mockResolvedValue({ data: { id: 'newsletter-123' } });

      await sendNewsletterWelcomeEmail('test@example.com', 'token123');

      expect(mockEmailTemplates.newsletterWelcomeTemplate).toHaveBeenCalledWith(
        'test@example.com',
        'http://localhost:3000/unsubscribe?token=token123'
      );
    });

    test('handles email sending error', async () => {
      const error = new Error('Rate limit exceeded');
      resend.emails.send.mockRejectedValue(error);

      const result = await sendNewsletterWelcomeEmail('test@example.com', 'token123');

      expect(result).toEqual({
        success: false,
        error: 'Rate limit exceeded'
      });
    });

    test('handles empty token', async () => {
      resend.emails.send.mockResolvedValue({ data: { id: 'newsletter-123' } });

      await sendNewsletterWelcomeEmail('test@example.com', '');

      expect(mockEmailTemplates.newsletterWelcomeTemplate).toHaveBeenCalledWith(
        'test@example.com',
        'https://test-restaurant.com/unsubscribe?token='
      );
    });
  });

  describe('sendUnsubscribeConfirmationEmail', () => {
    test('sends unsubscribe confirmation email successfully', async () => {
      resend.emails.send.mockResolvedValue({
        data: { id: 'unsubscribe-123' }
      });

      const result = await sendUnsubscribeConfirmationEmail('test@example.com');

      expect(result).toEqual({
        success: true,
        messageId: 'unsubscribe-123'
      });

      expect(resend.emails.send).toHaveBeenCalledWith({
        from: 'test@restaurant.com',
        to: ['test@example.com'],
        subject: '👋 Désabonnement confirmé',
        html: '<html>Unsubscribe template</html>',
        replyTo: 'contact@restaurant.com'
      });

      expect(mockEmailTemplates.unsubscribeConfirmationTemplate).toHaveBeenCalledWith('test@example.com');
    });

    test('handles email sending error', async () => {
      const error = new Error('Service temporarily unavailable');
      resend.emails.send.mockRejectedValue(error);

      const result = await sendUnsubscribeConfirmationEmail('test@example.com');

      expect(result).toEqual({
        success: false,
        error: 'Service temporarily unavailable'
      });
    });

    test('handles invalid email format', async () => {
      resend.emails.send.mockResolvedValue({ data: { id: 'unsubscribe-123' } });

      await sendUnsubscribeConfirmationEmail('invalid-email');

      expect(resend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ['invalid-email']
        })
      );
    });
  });

  describe('generateUnsubscribeToken', () => {
    test('generates a token', () => {
      const token1 = generateUnsubscribeToken();
      const token2 = generateUnsubscribeToken();

      expect(typeof token1).toBe('string');
      expect(typeof token2).toBe('string');
      expect(token1.length).toBeGreaterThan(10);
      expect(token2.length).toBeGreaterThan(10);
    });

    test('generates unique tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateUnsubscribeToken());
      }
      expect(tokens.size).toBe(100); // All tokens should be unique
    });

    test('generates tokens with expected format', () => {
      const token = generateUnsubscribeToken();
      
      // Should contain only alphanumeric characters
      expect(token).toMatch(/^[a-z0-9]+$/);
      
      // Should be reasonably long for security
      expect(token.length).toBeGreaterThan(15);
    });

    test('tokens change over time', async () => {
      const token1 = generateUnsubscribeToken();
      
      // Wait a tiny bit to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 1));
      
      const token2 = generateUnsubscribeToken();
      
      expect(token1).not.toBe(token2);
    });

    test('handles edge case where Math.random returns 0', () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0);

      const token = generateUnsubscribeToken();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      Math.random = originalRandom;
    });
  });

  describe('edge cases and error handling', () => {
    test('handles resend returning undefined data', async () => {
      resend.emails.send.mockResolvedValue({ data: undefined });

      const result = await sendReservationEmail('CONFIRMED', mockReservationData);

      expect(result).toEqual({
        success: true,
        messageId: undefined
      });
    });

    test('handles resend returning null', async () => {
      resend.emails.send.mockResolvedValue(null);

      const result = await sendReservationEmail('CONFIRMED', mockReservationData);

      expect(result).toEqual({
        success: false,
        error: expect.any(String)
      });
    });

    test('logs messages appropriately', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Success case
      resend.emails.send.mockResolvedValue({ data: { id: 'test-123' } });
      await sendReservationEmail('CONFIRMED', mockReservationData);

      // Error case
      resend.emails.send.mockRejectedValue(new Error('Test error'));
      await sendReservationEmail('CONFIRMED', mockReservationData);

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});