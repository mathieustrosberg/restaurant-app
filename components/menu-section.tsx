"use client";

import { useState } from "react";

// Catégories affichées dans la barre de filtres
const CATEGORIES = [
  { key: "all", label: "Tous" },
  { key: "entree", label: "Entrées" },
  { key: "plat", label: "Plats" },
  { key: "dessert", label: "Desserts" },
];

// Items du menu (désormais avec description et prix)
const ITEMS = [
  {
    name: "Tapenade Provençale",
    category: "entree",
    description: "Olives, câpres et anchois finement mixés, servis avec croûtons.",
    price: "8€",
  },
  {
    name: "Velouté de courge",
    category: "entree",
    description: "Crémeux de courge musquée, crème fraîche et noisettes torréfiées.",
    price: "9€",
  },
  {
    name: "Steak‑frites",
    category: "plat",
    description: "Pièce de bœuf française, frites maison et sauce béarnaise.",
    price: "22€",
  },
  {
    name: "Filet de bar rôti",
    category: "plat",
    description: "Filet de bar, purée de panais et beurre blanc citronné.",
    price: "24€",
  },
  {
    name: "Tarte Tatin",
    category: "dessert",
    description: "Pommes caramélisées, pâte feuilletée et crème fraîche épaisse.",
    price: "7€",
  },
  {
    name: "Mousse au chocolat",
    category: "dessert",
    description: "Chocolat noir 70 %, pointe de fleur de sel.",
    price: "6€",
  },
];

export default function MenuSection() {
  const [active, setActive] = useState("all");

  const filteredItems =
    active === "all" ? ITEMS : ITEMS.filter((item) => item.category === active);

  return (
    <section className="md:py-50 px-12">
      <h1 className="text-4xl font-neue font-normal mb-4">
        Découvrez <span className="font-editorial">notre menu.</span>
      </h1>
      <p className="text-base mb-10">
        Laissez-vous guider par nos suggestions, des entrées délicates aux
        grillades d'exception.
        <br />
        Pour nos jeunes gourmets, nous avons imaginé un menu tout en finesse,
        qui se conclut par une jolie surprise.
      </p>

      {/* Boutons de filtre */}
      <div role="group" className="filter-buttons flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            data-filter-target={cat.key}
            className={`filter-btn rounded-full px-5 py-2 text-lg transition-colors duration-300 ${
              active === cat.key ? "bg-black text-[#EFEEEC]" : "bg-[#EFEEEC]"
            }`}
            aria-pressed={active === cat.key}
            onClick={() => setActive(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Liste des plats */}
      <div
        aria-live="polite"
        role="list"
        id="filter-list"
        className="filter-list flex flex-col"
      >
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            role="listitem"
            className="filter-list__item py-4"
          >
            <div className="flex flex-col justify-between sm:flex-row sm:items-center sm:gap-4">
<div className="flex flex-col">
    <h2 className="text-2xl font-medium">{item.name}</h2>
    <p className="text-base/5">{item.description}</p>
</div>
              <span className="text-lg font-medium sm:w-1/6 w-full sm:text-right mt-2 sm:mt-0">
                {item.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
