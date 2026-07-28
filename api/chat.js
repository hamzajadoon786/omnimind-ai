export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, model } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  const apiKey = process.env.HF_TOKEN;
  if (!apiKey) {
    return res.status(500).json({ error: 'API token is missing in Vercel environment variables.' });
  }

  const selectedModel = model || 'meta-llama/Meta-Llama-3-8B-Instruct';

  // Construct prompt history for Instruct models
  const lastUserMessage = messages[messages.length - 1]?.content || '';

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${selectedModel}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: lastUserMessage,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Hugging Face API Error:', result);
      return res.status(response.status).json({
        error: result.error || 'Failed to fetch response from model.'
      });
    }

    let replyText = '';
    if (Array.isArray(result) && result[0]?.generated_text) {
      replyText = result[0].generated_text;
    } else if (result.generated_text) {
      replyText = result.generated_text;
    } else {
      replyText = typeof result === 'string' ? result : JSON.stringify(result);
    }

    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error('Serverless Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
      }
