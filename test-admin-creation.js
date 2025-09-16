// Test script pour créer l'admin avec les bonnes variables d'environnement
const fetch = require('node-fetch');

async function testAdminCreation() {
  try {
    console.log('🔄 Testing admin creation on Vercel...');
    
    const response = await fetch('https://restaurant-app-peach-nine.vercel.app/api/create-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'auvsMVFfHYvxuHWF6ookRdX7JdJ68DNh'
      })
    });
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAdminCreation();
