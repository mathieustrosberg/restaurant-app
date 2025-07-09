"use client";

import { useState } from "react";

export default function BookingSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="md:py-50 px-12">
      <h1 className="text-4xl font-neue font-normal mb-4">
        Réservez <span className="font-editorial">votre table.</span>
      </h1>
      <p className="text-base mb-10">
      Choisissez la date et l’heure qui vous conviennent, nous préparerons votre table avec soin.
        <br />
        Qu’il s’agisse d’un déjeuner d’affaires ou d’un dîner en tête-à-tête, notre équipe saura rendre votre venue inoubliable.
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" />
        </div>
      </div>
    </section>
  );
}

