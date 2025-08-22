import { sendContactNotificationEmail } from '@/lib/email-service'
import { ContactNotificationData } from '@/lib/resend'

// Mock Resend
jest.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: jest.fn()
    }
  },
  EMAIL_CONFIG: {
    from: 'Restaurant <onboarding@resend.dev>',
    adminEmail: 'mathieustrosberg@gmail.com',
    replyTo: 'mathieustrosberg@gmail.com'
  }
}))

// Mock des templates
jest.mock('@/lib/email-templates', () => ({
  contactNotificationTemplate: jest.fn(() => '<html>Mock Template</html>')
}))

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sendContactNotificationEmail', () => {
    const mockContactData: ContactNotificationData = {
      customerName: 'Jean Dupont',
      customerEmail: 'jean@example.com',
      subject: 'Demande de réservation',
      message: 'Bonjour, je souhaiterais réserver une table.',
      phone: '01 23 45 67 89'
    }

    it('envoie une notification email avec les bonnes données', async () => {
      const { resend } = require('@/lib/resend')
      const { contactNotificationTemplate } = require('@/lib/email-templates')
      
      resend.emails.send.mockResolvedValue({
        data: { id: 'email-123' }
      })

      const result = await sendContactNotificationEmail(mockContactData)

      expect(resend.emails.send).toHaveBeenCalledWith({
        from: 'Restaurant <onboarding@resend.dev>',
        to: ['mathieustrosberg@gmail.com'],
        subject: '🔔 Nouveau message de contact : Demande de réservation',
        html: '<html>Mock Template</html>',
        replyTo: 'jean@example.com'
      })

      expect(contactNotificationTemplate).toHaveBeenCalledWith(mockContactData)
      expect(result).toEqual({ success: true, messageId: 'email-123' })
    })

    it('gère les données sans téléphone', async () => {
      const { resend } = require('@/lib/resend')
      
      resend.emails.send.mockResolvedValue({
        data: { id: 'email-456' }
      })

      const dataWithoutPhone = { ...mockContactData }
      delete dataWithoutPhone.phone

      const result = await sendContactNotificationEmail(dataWithoutPhone)

      expect(result.success).toBe(true)
    })

    it('gère les erreurs d\'envoi', async () => {
      const { resend } = require('@/lib/resend')
      
      resend.emails.send.mockRejectedValue(new Error('Erreur Resend'))

      const result = await sendContactNotificationEmail(mockContactData)

      expect(result).toEqual({
        success: false,
        error: 'Erreur Resend'
      })
    })

    it('configure le replyTo avec l\'email du client', async () => {
      const { resend } = require('@/lib/resend')
      
      resend.emails.send.mockResolvedValue({
        data: { id: 'email-789' }
      })

      await sendContactNotificationEmail(mockContactData)

      const callArgs = resend.emails.send.mock.calls[0][0]
      expect(callArgs.replyTo).toBe('jean@example.com')
    })
  })
})

