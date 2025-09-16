import { auth } from "@/lib/auth"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const cookie = req.headers.get('cookie') || ''
    const session = await auth.api.getSession({
      headers: { cookie }
    })
    return Response.json(session)
  } catch (e: any) {
    return Response.json({ error: e?.message || 'Failed to get session' }, { status: 500 })
  }
}


