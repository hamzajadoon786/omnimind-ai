export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, message } = req.body || {};

  // Mistral API Key Check
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'MISTRAL_API_KEY is missing in Vercel environment variables.' });
  }

  // Format messages array
  let formattedMessages = [];
  if (messages && Array.isArray(messages)) {
    formattedMessages = messages;
  } else if (message) {
    formattedMessages = [{ role: 'user', content: message }];
  } else {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  try {
    // Official Mistral AI API Call
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Mistral API Error:', result);
      return res.status(response.status).json({
        error: result.error?.message || 'Failed to fetch response from Mistral API.'
      });
    }

    const replyText = result.choices?.[0]?.message?.content || '';

    // Returns response in standard format
    return res.status(200).json({ 
      reply: replyText,
      generated_text: replyText,
      choices: result.choices 
    });

  } catch (error) {
    console.error('Serverless Error:', error);
    return res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
      }
