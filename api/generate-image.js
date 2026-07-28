export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Hugging Face Inference API for Flux.1-schnell (High speed & quality)
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/v1/models/black-forest-labs/FLUX.1-schnell',
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HuggingFace Error:', errorText);
      return res.status(500).json({ error: 'Failed to generate image from AI model' });
    }

    // Convert binary image buffer to Base64
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    return res.status(200).json({ imageUrl: base64Image });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
                                }
