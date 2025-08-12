import Link from "next/link";

export const metadata = {
  title: "Mentions légales",
  description: "Informations légales du site du restaurant",
};

export default function MentionsLegalesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 prose prose-slate flex-1">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 no-underline"
        >
          ← Retour à l'accueil
        </Link>
      </div>
      <h1>Mentions légales</h1>
      <p>
        Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique.
      </p>

      <h2>Éditeur du site</h2>
      <p>
        Dénomination sociale: Mon Restaurant<br />
        Adresse: [votre adresse]<br />
        Téléphone: [votre téléphone]<br />
        Email: [votre email]<br />
        Directeur de la publication: [nom du responsable]
      </p>

      <h2>Hébergement</h2>
      <p>
        Hébergeur: [nom de l&apos;hébergeur]<br />
        Adresse: [adresse de l&apos;hébergeur]<br />
        Téléphone: [téléphone de l&apos;hébergeur]
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus (textes, images, logos, marques, etc.) présents sur ce site sont protégés par le droit de la propriété intellectuelle. Toute reproduction, représentation, modification ou utilisation est interdite sans autorisation écrite préalable.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Mon Restaurant met tout en œuvre pour assurer l&apos;exactitude des informations diffusées mais ne peut garantir leur exhaustivité. L&apos;utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
      </p>
    </main>
  );
}


