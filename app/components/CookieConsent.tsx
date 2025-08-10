"use client";
import React from "react";

const COOKIE_NAME = "cookie_consent";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

export default function CookieConsent(): React.ReactElement | null {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const existing = getCookie(COOKIE_NAME);
    if (!existing) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[640px] z-50">
      <div className="rounded-md border bg-white shadow-lg p-4 sm:p-5">
        <p className="text-sm text-gray-800">
          Nous utilisons des cookies essentiels pour le fonctionnement du site et, avec votre consentement, des cookies de mesure d’audience anonymes. Consultez notre
          {" "}
          <a href="/cookies" className="underline">Politique Cookies</a> et notre
          {" "}
          <a href="/politique-de-confidentialite" className="underline">Politique de confidentialité</a>.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setCookie(COOKIE_NAME, "necessary", 180);
              setVisible(false);
            }}
            className="px-3 py-1.5 rounded border text-sm"
          >
            Refuser non essentiels
          </button>
          <button
            onClick={() => {
              setCookie(COOKIE_NAME, "all", 180);
              setVisible(false);
            }}
            className="px-3 py-1.5 rounded bg-black text-white text-sm"
          >
            Accepter tout
          </button>
        </div>
      </div>
    </div>
  );
}


