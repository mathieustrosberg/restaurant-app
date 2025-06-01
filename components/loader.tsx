"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

export default function Loader() {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const loadingWords = document.querySelector(
        "[data-loading-words]"
      ) as HTMLElement | null
      const wordsTarget = document.querySelector(
        "[data-loading-words-target]"
      ) as HTMLElement | null
      if (!loadingWords || !wordsTarget) return

      const words = loadingWords.dataset.loadingWords!
        .split(",")
        .map((w) => w.trim())

      const tl = gsap.timeline()

      // apparition du bloc
      tl.from(loadingWords, {
        opacity: 0,
        yPercent: 50,
        duration: 1.2,
        ease: "expo.inOut",
      })

      // boucle sur chaque mot
      words.forEach((word) => {
        tl.call(() => {
          wordsTarget.textContent = word
        }, undefined, "+=0.15")
      })

      // disparition
      tl.to(loadingWords, {
        opacity: 0,
        yPercent: -75,
        duration: 0.8,
        ease: "expo.in",
      })
      tl.to(
        containerRef.current,
        {
          autoAlpha: 0,
          duration: 0.6,
          ease: "power1.inOut",
        },
        "-=0.2"
      )

      return () => ctx.revert()
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      data-loading-container
      className="fixed inset-0 z-[500] pointer-events-none overflow-hidden"
    >
      <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-black text-white pointer-events-auto">
        <div
          data-loading-words="Hello, Bonjour, स्वागत हे, Ciao, Olá, おい, Hallå, Guten tag, Hallo"
          className="flex items-center gap-8 sm:gap-6"
        >
          <p
            data-loading-words-target
            className="m-0 leading-none text-[clamp(1.375vw, 4.5rem, 2.25rem)]"
          >
            Loon-Garden Restaurant
          </p>
        </div>
      </div>
    </div>
  )
}