"use client"

import { useContent } from '@/lib/hooks/useContent'

export default function InfoBanner() {
  const { content, loading } = useContent()

  if (loading) {
    return (
      <section className="md:p-50 py-50 px-20 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded mx-auto max-w-4xl mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mx-auto max-w-3xl mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mx-auto max-w-2xl"></div>
        </div>
      </section>
    )
  }

  const infoBannerData = content?.infoBanner || {
    text: "De belles assiettes d'entrées, des grillades tendres et savoureuses, du poisson et des plats cuisinés. Nous n'oublions pas les plus petits avec un menu spécifique incluant une surprise. Nous sommes déjà ravis à la perspective de vous servir."
  }

  return (
    <section className="md:p-50 py-50 px-20 text-center">
      <p className="mx-auto">{infoBannerData.text}</p>
    </section>
  )
}