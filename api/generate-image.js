export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, model } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    return res.status(500).json({ error: 'HF_TOKEN missing in environment variables.' });
  }

  // Realistic Face / Image Models
  const selectedModel = model || 'black-forest-labs/FLUX.1-schnell'; 
  // Alt models: 'stabilityai/stable-diffusion-xl-base-1.0'

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${selectedModel}`,
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData.error || 'Failed to generate image.'
      });
    }

    // Hugging Face returns raw binary Image Blob
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;

    return res.status(200).json({ imageUrl: imageSrc });

  } catch (error) {
    console.error('Image Generation Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
    }
