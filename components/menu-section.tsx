"use client";

import { useState } from "react";
import { useContent } from '@/lib/hooks/useContent'

// Catégories affichées dans la barre de filtres
const CATEGORIES = [
  { key: "all", label: "Tous" },
  { key: "entree", label: "Entrées" },
  { key: "plat", label: "Plats" },
  { key: "dessert", label: "Desserts" },
];

export default function MenuSection() {
  const [active, setActive] = useState("all");
  const { content, loading } = useContent()

  if (loading) {
    return (
      <section className="md:py-50 px-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-80 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full max-w-2xl mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full max-w-xl mb-10"></div>
          
          <div className="flex gap-2 mb-6">
            {CATEGORIES.map((_, idx) => (
              <div key={idx} className="h-10 bg-gray-300 rounded-full w-20"></div>
            ))}
          </div>
          
          <div className="space-y-4">
            {[1,2,3].map((idx) => (
              <div key={idx} className="py-4">
                <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full max-w-md"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const menuData = content?.menuSection || {
    title: "Découvrez ",
    subtitle: "",
    highlightText: "notre menu.",
    description: "Laissez-vous guider par nos suggestions, des entrées délicates aux grillades d'exception.\nPour nos jeunes gourmets, nous avons imaginé un menu tout en finesse, qui se conclut par une jolie surprise.",
    items: []
  }

  const filteredItems =
    active === "all" ? menuData.items : menuData.items.filter((item) => item.category === active);

  return (
    <section className="md:py-50 px-12">
      <h1 className="text-4xl font-neue font-normal mb-4">
        {menuData.title}
        {menuData.subtitle && <span>{menuData.subtitle}</span>}
        <span className="font-editorial">{menuData.highlightText}</span>
      </h1>
      <p className="text-base mb-10 whitespace-pre-line">
        {menuData.description}
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
        {filteredItems.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>Aucun plat trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>
    </section>
  );
}
