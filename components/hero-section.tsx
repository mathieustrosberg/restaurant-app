"use client"

import { useContent } from '@/lib/hooks/useContent'

export default function HeroSection() {
  const { content, loading } = useContent()

  if (loading) {
    return (
      <section className="hero-section">
        <div className="h-screen w-full bg-red-500 opacity-30">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-64"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const heroData = content?.heroSection || {
    title: "Chez nous,",
    subtitle: "il y en a pour ",
    highlightText: "tous les goûts"
  }

  return (
    <section className="hero-section">
      <div className="h-screen w-full bg-red-500 opacity-30">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-neue">{heroData.title}</h1>
          <p className="text-4xl font-neue">
            {heroData.subtitle}
            <span className="font-editorial">{heroData.highlightText}</span>
          </p>
        </div>
      </div>
    </section>
  )
}