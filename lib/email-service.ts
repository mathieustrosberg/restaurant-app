import { resend, EMAIL_CONFIG, ReservationEmailData, ContactResponseData } from './resend';
import {
  reservationConfirmedTemplate,
  reservationCanceledTemplate,
  contactResponseTemplate,
  newsletterWelcomeTemplate,
  unsubscribeConfirmationTemplate
} from './email-templates';

// Service d'envoi d'emails pour les réservations
export async function sendReservationEmail(
  status: 'CONFIRMED' | 'CANCELED',
  data: ReservationEmailData
) {
  try {
    const isConfirmed = status === 'CONFIRMED';
    const subject = isConfirmed 
      ? '✅ Réservation confirmée - Restaurant'
      : '❌ Réservation non disponible - Restaurant';
    
    const html = isConfirmed 
      ? reservationConfirmedTemplate(data)
      : reservationCanceledTemplate(data);

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [data.customerEmail],
      subject,
      html,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    console.log(`Email de réservation ${status} envoyé à ${data.customerEmail}:`, result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réservation:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

// Service d'envoi d'emails pour les réponses de contact
export async function sendContactResponseEmail(data: ContactResponseData) {
  try {
    const subject = `Re: ${data.originalSubject}`;
    const html = contactResponseTemplate(data);

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [data.customerEmail],
      subject,
      html,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    console.log(`Email de réponse de contact envoyé à ${data.customerEmail}:`, result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réponse:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

// Service d'envoi d'emails pour la newsletter
export async function sendNewsletterWelcomeEmail(email: string, unsubscribeToken: string) {
  try {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/unsubscribe?token=${unsubscribeToken}`;
    const subject = '🎉 Bienvenue dans notre newsletter !';
    const html = newsletterWelcomeTemplate(email, unsubscribeUrl);

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [email],
      subject,
      html,
      replyTo: EMAIL_CONFIG.replyTo,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });

    console.log(`Email de bienvenue newsletter envoyé à ${email}:`, result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

// Service d'envoi d'emails pour la confirmation de désabonnement
export async function sendUnsubscribeConfirmationEmail(email: string) {
  try {
    const subject = '👋 Désabonnement confirmé';
    const html = unsubscribeConfirmationTemplate(email);

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [email],
      subject,
      html,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    console.log(`Email de confirmation de désabonnement envoyé à ${email}:`, result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de désabonnement:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

// Fonction utilitaire pour générer un token de désabonnement sécurisé
export function generateUnsubscribeToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
