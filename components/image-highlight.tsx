"use client"

import { useContent } from '@/lib/hooks/useContent'

export default function ImageHighlight() {
  const { content, loading } = useContent()

  if (loading) {
    return (
      <section className="w-full h-auto relative">
        <div className="h-[1100px] object-cover w-full brightness-90 bg-gray-300 animate-pulse">
        </div>
        <div className="absolute md:top-[-50px] top-[-85px] left-12 transform -translate-y-1 md:w-[300px] w-[150px] h-[400px] bg-gray-400 animate-pulse"></div>
      </section>
    )
  }

  const imageData = content?.imageHighlight || {
    mainColor: "#ef4444",
    overlayColor: "#ef4444",
    opacity: 30
  }

  return (
    <section className="w-full h-auto relative">
      <div 
        className="h-[1100px] object-cover w-full brightness-90"
        style={{ 
          backgroundColor: imageData.mainColor,
          opacity: imageData.opacity / 100
        }}
      >
      </div>
      <div 
        className="absolute md:top-[-50px] top-[-85px] left-12 transform -translate-y-1 md:w-[300px] w-[150px] h-[400px]"
        style={{ 
          backgroundColor: imageData.overlayColor,
          opacity: (imageData.opacity + 10) / 100
        }}
      ></div>
    </section>
  )
}