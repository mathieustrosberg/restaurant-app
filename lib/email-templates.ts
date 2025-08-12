import { ReservationEmailData, ContactResponseData } from './resend';

// Template de base pour tous les emails
const baseTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
    .content { padding: 30px 20px; }
    .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin: 10px 0; }
    .status-confirmed { background-color: #d4edda; color: #155724; }
    .status-canceled { background-color: #f8d7da; color: #721c24; }
    .info-box { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #e9ecef; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
    .unsubscribe { font-size: 12px; color: #999; margin-top: 20px; }
    .unsubscribe a { color: #999; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>
`;

// Template pour confirmation de réservation
export const reservationConfirmedTemplate = (data: ReservationEmailData) => {
  const serviceLabel = data.service === 'lunch' ? 'Déjeuner' : 'Dîner';
  const formattedDate = new Date(data.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const content = `
    <div class="header">
      <h1>🎉 Réservation Confirmée</h1>
    </div>
    <div class="content">
      <h2>Bonjour ${data.customerName},</h2>
      <p>Excellente nouvelle ! Votre réservation a été <strong>confirmée</strong>.</p>
      
      <div class="status-badge status-confirmed">✅ Confirmée</div>
      
      <div class="info-box">
        <h3>📋 Détails de votre réservation</h3>
        <p><strong>Date :</strong> ${formattedDate}</p>
        <p><strong>Heure :</strong> ${data.time}</p>
        <p><strong>Service :</strong> ${serviceLabel}</p>
        <p><strong>Nombre de personnes :</strong> ${data.people}</p>
        ${data.notes ? `<p><strong>Notes :</strong> ${data.notes}</p>` : ''}
      </div>
      
      <p>Nous avons hâte de vous accueillir dans notre restaurant ! Si vous avez des questions ou devez modifier votre réservation, n'hésitez pas à nous contacter.</p>
      
      <p>À bientôt,<br><strong>L'équipe du Restaurant</strong></p>
    </div>
    <div class="footer">
      <p>📍 Adresse du restaurant • 📞 Téléphone • 🌐 site-web.com</p>
    </div>
  `;
  
  return baseTemplate(content, 'Réservation Confirmée');
};

// Template pour refus de réservation
export const reservationCanceledTemplate = (data: ReservationEmailData) => {
  const serviceLabel = data.service === 'lunch' ? 'Déjeuner' : 'Dîner';
  const formattedDate = new Date(data.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const content = `
    <div class="header">
      <h1>😔 Réservation Non Disponible</h1>
    </div>
    <div class="content">
      <h2>Bonjour ${data.customerName},</h2>
      <p>Nous vous remercions pour votre demande de réservation. Malheureusement, nous ne pouvons pas confirmer votre réservation pour la date et l'heure demandées.</p>
      
      <div class="status-badge status-canceled">❌ Non disponible</div>
      
      <div class="info-box">
        <h3>📋 Demande de réservation</h3>
        <p><strong>Date :</strong> ${formattedDate}</p>
        <p><strong>Heure :</strong> ${data.time}</p>
        <p><strong>Service :</strong> ${serviceLabel}</p>
        <p><strong>Nombre de personnes :</strong> ${data.people}</p>
      </div>
      
      <p>Nous vous invitons à choisir une autre date ou heure. N'hésitez pas à nous contacter directement pour vérifier nos disponibilités.</p>
      
      <p>Cordialement,<br><strong>L'équipe du Restaurant</strong></p>
    </div>
    <div class="footer">
      <p>📍 Adresse du restaurant • 📞 Téléphone • 🌐 site-web.com</p>
    </div>
  `;
  
  return baseTemplate(content, 'Réservation Non Disponible');
};

// Template pour réponse de contact
export const contactResponseTemplate = (data: ContactResponseData) => {
  const content = `
    <div class="header">
      <h1>💬 Réponse à votre message</h1>
    </div>
    <div class="content">
      <h2>Bonjour ${data.customerName},</h2>
      <p>Merci pour votre message. Voici notre réponse :</p>
      
      <div class="info-box">
        <h3>📨 Votre message original</h3>
        <p><strong>Sujet :</strong> ${data.originalSubject}</p>
        <p><em>${data.originalMessage}</em></p>
      </div>
      
      <div class="info-box">
        <h3>💡 Notre réponse</h3>
        <p>${data.response}</p>
      </div>
      
      <p>Si vous avez d'autres questions, n'hésitez pas à nous recontacter.</p>
      
      <p>Cordialement,<br><strong>L'équipe du Restaurant</strong></p>
    </div>
    <div class="footer">
      <p>📍 Adresse du restaurant • 📞 Téléphone • 🌐 site-web.com</p>
    </div>
  `;
  
  return baseTemplate(content, 'Réponse à votre message');
};

// Template pour bienvenue newsletter
export const newsletterWelcomeTemplate = (email: string, unsubscribeUrl: string) => {
  const content = `
    <div class="header">
      <h1>🎉 Bienvenue dans notre Newsletter</h1>
    </div>
    <div class="content">
      <h2>Merci pour votre abonnement !</h2>
      <p>Nous sommes ravis de vous compter parmi nos abonnés. Vous recevrez désormais nos dernières actualités, nos nouveautés culinaires et nos offres spéciales.</p>
      
      <div class="info-box">
        <h3>📧 Ce que vous recevrez :</h3>
        <ul>
          <li>🍽️ Nos nouveaux plats et menus saisonniers</li>
          <li>🎉 Nos événements spéciaux et soirées thématiques</li>
          <li>💝 Des offres exclusives réservées à nos abonnés</li>
          <li>📸 Les coulisses de notre restaurant</li>
        </ul>
      </div>
      
      <p>À très bientôt dans votre boîte email !</p>
      
      <p>L'équipe du Restaurant</p>
      
      <div class="unsubscribe">
        <p>Vous pouvez vous <a href="${unsubscribeUrl}">désabonner</a> à tout moment.</p>
      </div>
    </div>
    <div class="footer">
      <p>📍 Adresse du restaurant • 📞 Téléphone • 🌐 site-web.com</p>
    </div>
  `;
  
  return baseTemplate(content, 'Bienvenue dans notre Newsletter');
};

// Template pour confirmation de désabonnement
export const unsubscribeConfirmationTemplate = (email: string) => {
  const content = `
    <div class="header">
      <h1>👋 Désabonnement Confirmé</h1>
    </div>
    <div class="content">
      <h2>Au revoir !</h2>
      <p>Votre désabonnement de notre newsletter a été confirmé. Vous ne recevrez plus d'emails de notre part.</p>
      
      <p>Si vous changez d'avis, vous pourrez toujours vous réabonner sur notre site web.</p>
      
      <p>Merci d'avoir fait partie de notre communauté !</p>
      
      <p>L'équipe du Restaurant</p>
    </div>
    <div class="footer">
      <p>📍 Adresse du restaurant • 📞 Téléphone • 🌐 site-web.com</p>
    </div>
  `;
  
  return baseTemplate(content, 'Désabonnement Confirmé');
};
