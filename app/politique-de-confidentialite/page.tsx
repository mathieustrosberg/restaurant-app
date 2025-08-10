export const metadata = {
  title: "Politique de confidentialité",
  description: "Informations sur la protection des données personnelles (RGPD)",
};

export default function ConfidentialitePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 prose prose-slate">
      <h1>Politique de confidentialité</h1>
      <p>
        Cette politique explique quelles données nous collectons, pourquoi, et comment vous pouvez exercer vos droits conformément au RGPD.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>Contact: nom, email, sujet, message.</li>
        <li>Réservations: nom, email, téléphone, date/heure, nombre de personnes, notes.</li>
        <li>Newsletter: email.</li>
        <li>Cookies: cookies essentiels et, si vous y consentez, mesure d’audience anonyme.</li>
      </ul>

      <h2>Bases légales</h2>
      <ul>
        <li>Exécution de mesures précontractuelles ou contractuelles (gestion des réservations).</li>
        <li>Intérêt légitime (réponse aux messages).</li>
        <li>Consentement (newsletter et cookies non essentiels).</li>
        <li>Obligation légale (facturation, le cas échéant).</li>
      </ul>

      <h2>Durées de conservation</h2>
      <ul>
        <li>Contacts: 12 mois.</li>
        <li>Réservations: 24 mois après la dernière visite (sauf obligation légale différente).</li>
        <li>Newsletter: jusqu’au désabonnement.</li>
        <li>Cookies: voir la page Cookies.</li>
      </ul>

      <h2>Destinataires et transferts</h2>
      <p>
        Les données sont traitées en interne et hébergées chez nos prestataires techniques. Aucun transfert en dehors de l’UE sans garanties adéquates.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez des droits d’accès, rectification, effacement, limitation, opposition et portabilité. Pour exercer vos droits ou pour toute question, contactez-nous à: [votre email].
      </p>
      <p>
        Vous pouvez aussi:<br />
        - Demander l’accès ou la suppression de vos messages de contact via l’ID communiqué par email.<br />
        - Demander la suppression de réservation via l’ID de réservation.<br />
        - Vous désinscrire de la newsletter via le lien de désabonnement ou en nous contactant.
      </p>

      <h2>Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données.
      </p>
    </main>
  );
}


