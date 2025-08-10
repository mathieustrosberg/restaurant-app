import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@/lib/auth"

// Next.js App Router handler pour /api/auth/*
export const { GET, POST } = toNextJsHandler(auth)
