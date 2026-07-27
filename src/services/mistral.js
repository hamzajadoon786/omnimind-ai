// Vercel / .env سے API Key حاصل کرنا
const API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
const API_URL = "https://api.mistral.ai/v1/chat/completions";

/**
 * Mistral AI کو میسج بھیجنے کا فانکشن
 * @param {string} userPrompt - صارف کا میسج
 * @returns {Promise<string>} - AI کا جواب
 */
export const askMistral = async (userPrompt) => {
  if (!API_KEY) {
    throw new Error("Mistral API Key نہیں ملی! Vercel Environment Variables چیک کریں۔");
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-tiny", // آپ mistral-small یا mistral-medium بھی رکھ سکتے ہیں
        messages: [
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API میں کوئی مسئلہ آیا ہے۔");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Mistral API Error:", error);
    throw error;
  }
};
