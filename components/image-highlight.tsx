"use client"

export default function ImageHighlight() {
  return (
    <section className="w-full h-auto relative">
      <div className="h-[1100px] object-cover w-full brightness-90 bg-red-500 opacity-30">
      </div>
        <div className="absolute md:top-[-50px] top-[-85px] left-12 transform -translate-y-1 md:w-[300px] w-[150px] h-[400px] bg-red-500 opacity-40"></div>
    </section>
  )
}