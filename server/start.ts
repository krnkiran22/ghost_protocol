import dotenv from 'dotenv';
dotenv.config();

// Check environment variables
const requiredVars = ['PINATA_API_KEY', 'PINATA_SECRET_KEY', 'GROQ_API_KEY'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n📋 Please create a .env file with the following variables:');
  console.error('   PINATA_API_KEY=your_pinata_api_key_here');
  console.error('   PINATA_SECRET_KEY=your_pinata_secret_key_here');
  console.error('   GROQ_API_KEY=your_groq_api_key_here');
  console.error('\n🔗 Get keys from:');
  console.error('   Pinata: https://pinata.cloud/');
  console.error('   Groq: https://console.groq.com/');
  process.exit(1);
}

console.log('✅ All environment variables are configured');

// Import and start the server
import './index.js';