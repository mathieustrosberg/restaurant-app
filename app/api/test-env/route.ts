export async function GET() {
  return Response.json({
    env_vars: {
      has_mongodb_uri: !!process.env.MONGODB_URI,
      mongodb_uri_start: process.env.MONGODB_URI?.substring(0, 30) + '...',
      has_mongodb_db: !!process.env.MONGODB_DB,
      mongodb_db: process.env.MONGODB_DB,
      has_better_auth_secret: !!process.env.BETTER_AUTH_SECRET,
      has_better_auth_url: !!process.env.BETTER_AUTH_URL,
      better_auth_url: process.env.BETTER_AUTH_URL,
      node_env: process.env.NODE_ENV,
      vercel_env: process.env.VERCEL_ENV
    }
  })
}

export async function POST() {
  try {
    // Test simple sans MongoDB d'abord
    console.log('Testing basic functionality...')
    
    const testData = {
      timestamp: new Date().toISOString(),
      random: Math.random(),
      env_test: 'working'
    }
    
    return Response.json({
      success: true,
      message: "Basic API functionality working",
      test_data: testData,
      mongodb_uri_format: process.env.MONGODB_URI?.includes('mongodb+srv://') ? 'Atlas format' : 'Invalid format'
    })
    
  } catch (error: any) {
    return Response.json({
      error: 'Basic test failed',
      details: error.message
    }, { status: 500 })
  }
}
