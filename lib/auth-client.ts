"use client"
import { createAuthClient } from "better-auth/react"

// Utiliser l'origine courante côté client pour éviter les problèmes entre domaines (preview/prod)
const runtimeBaseURL =
  typeof window !== 'undefined' && (window as any).location
    ? (window as any).location.origin
    : (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000')

export const authClient = createAuthClient({
  baseURL: runtimeBaseURL
})
