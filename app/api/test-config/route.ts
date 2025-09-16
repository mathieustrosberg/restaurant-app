import { NextRequest } from 'next/server'

export async function GET() {
  return Response.json({
    env_check: {
      has_mongodb_uri: !!process.env.MONGODB_URI,
      mongodb_uri_start: process.env.MONGODB_URI?.substring(0, 20) + '...',
      has_auth_secret: !!process.env.BETTER_AUTH_SECRET,
      has_auth_url: !!process.env.BETTER_AUTH_URL,
      auth_url: process.env.BETTER_AUTH_URL,
      has_mongodb_db: !!process.env.MONGODB_DB,
      mongodb_db: process.env.MONGODB_DB,
      node_env: process.env.NODE_ENV
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    
    return Response.json({
      secret_match: secret === process.env.BETTER_AUTH_SECRET,
      secret_received: !!secret,
      secret_env_exists: !!process.env.BETTER_AUTH_SECRET
    })
  } catch (error) {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}
