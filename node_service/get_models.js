const fetch = require('node-fetch');
require('dotenv').config();

async function getModels() {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const response = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
  });
  const data = await response.json();
  const llamaModels = data.data.filter(m => m.id.includes('llama') && m.active).map(m => m.id);
  console.log("Active Llama Models on Groq:");
  console.log(llamaModels.join('\n'));
}
getModels();
