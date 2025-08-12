import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Configuration des emails
export const EMAIL_CONFIG = {
  from: `${process.env.RESEND_FROM_NAME || 'Restaurant'} <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
  replyTo: process.env.RESEND_REPLY_TO || 'mathieustrosberg@gmail.com',
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