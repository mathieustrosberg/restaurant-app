import { ReactNode } from "react"
import "./globals.css"
import localFont from "next/font/local"


const neueMontreal = localFont({
  src: [
    {
      path: '../public/fonts/NeueMontreal-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/NeueMontreal-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-neue-montreal',
  display: 'swap', 
})

const ppEditorial = localFont({
  src: [
    {
      path: '../public/fonts/PPEditorial-Italic.otf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-pp-editorial',
  display: 'swap',
})
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${neueMontreal.variable} ${ppEditorial.variable}`}>
      <head>
        <link
          rel="preload"
          href="/fonts/NeueMontreal-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/PPEditorial-Italic.otf"
          as="font"
          type="font/otf"
          crossOrigin=""
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}