export const metadata = {
  title: "Cookies",
  description: "Informations sur les cookies utilisés par le site",
};

export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 prose prose-slate">
      <h1>Cookies</h1>
      <p>
        Nous utilisons des cookies pour assurer le bon fonctionnement du site et, avec votre consentement, pour mesurer de manière anonyme l’audience.
      </p>

      <h2>Cookies essentiels</h2>
      <p>
        Nécessaires au fonctionnement du site (ex: état de l’interface). Ils ne peuvent pas être désactivés.
      </p>

      <h2>Cookies de mesure d’audience</h2>
      <p>
        Utilisés uniquement si vous y consentez. Les données sont agrégées et anonymisées.
      </p>

      <h2>Gérer votre consentement</h2>
      <p>
        Vous pouvez modifier votre choix à tout moment en effaçant le cookie « cookie_consent » depuis les paramètres de votre navigateur. Une nouvelle bannière apparaîtra lors de votre prochaine visite.
      </p>
    </main>
  );
}


