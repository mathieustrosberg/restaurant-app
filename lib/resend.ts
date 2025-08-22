import { Resend } from 'resend';

// Validation de la clé API Resend
// En développement ou si la clé n'est pas définie, on utilise une clé par défaut
const apiKey = process.env.RESEND_API_KEY || 'dummy-key-for-build';

// Vérification stricte uniquement en production
if (process.env.NODE_ENV === 'production' && process.env.RESEND_API_KEY === 'dummy-key-for-build') {
  console.warn('⚠️  RESEND_API_KEY n\'est pas définie en production. Les emails ne fonctionneront pas.');
}

export const resend = new Resend(apiKey);

// Configuration des emails
export const EMAIL_CONFIG = {
  from: `${process.env.RESEND_FROM_NAME || 'Restaurant'} <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
  replyTo: process.env.RESEND_REPLY_TO || 'mathieustrosberg@gmail.com',
  // Adresse pour recevoir les notifications internes
  adminEmail: 'mathieustrosberg@gmail.com',
};

// Types pour les emails
export type ReservationStatus = 'CONFIRMED' | 'CANCELED';

export interface ReservationEmailData {
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  service: 'lunch' | 'dinner';
  people: number;
  notes?: string;
}

export interface ContactResponseData {
  customerName: string;
  customerEmail: string;
  originalSubject: string;
  originalMessage: string;
  response: string;
}

export interface NewsletterData {
  email: string;
  unsubscribeToken?: string;
}

export interface ContactNotificationData {
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  phone?: string;
}