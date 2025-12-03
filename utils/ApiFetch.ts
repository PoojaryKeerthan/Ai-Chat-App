// utils/geminiApi.ts
import axios from 'axios';
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY; // Replace in development only
const EXPO_PUBLIC_GEMINI_API_URL = process.env.EXPO_PUBLIC_GEMINI_API_URL;
const gemini = axios.create({
  baseURL: `${EXPO_PUBLIC_GEMINI_API_URL}`,
  params: {
    key: GEMINI_API_KEY,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getGeminiResponse = async (prompt: string) => {
  try {
    const res = await gemini.post('', {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    return res.data.candidates[0]?.content?.parts[0]?.text || 'No response.';
  } catch (error: any) {
    console.error('Gemini error:', error.response?.data || error.message);
    return 'Something went wrong.';
  }
};
