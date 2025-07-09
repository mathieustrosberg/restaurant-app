"use client"

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="h-screen w-full bg-red-500 opacity-30">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-neue">Chez nous,</h1>
          <p className="text-4xl font-neue">il y en a pour <span className="font-editorial">tous les goûts</span></p>
        </div>
      </div>
    </section>
  )
}