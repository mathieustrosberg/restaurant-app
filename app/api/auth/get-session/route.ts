import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth.api.getSession({})
    return Response.json(session)
  } catch (e: any) {
    return Response.json({ error: e?.message || 'Failed to get session' }, { status: 500 })
  }
}


