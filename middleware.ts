import { NextResponse, NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(req: NextRequest) {
  try {
    // Vérifier l'existence du cookie de session
    const sessionCookie = getSessionCookie(req)
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Si on a besoin de vérifier l'utilisateur spécifique, on peut faire un appel API
    const url = new URL('/api/auth/get-session', req.nextUrl.origin)
    const response = await fetch(url, {
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    })

    const session = await response.json()
    
    // Vérifier si l'utilisateur est bien admin
    if (!session?.user || session.user.email !== "admin@restaurant.com") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
  } catch (error) {
    // En cas d'erreur, rediriger vers login
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/dashboard"]
}
