import { GoogleGenerativeAI } from "@google/generative-ai";

const getGemini = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
};

export interface KineticIntel {
  manifesto: string;
  amenities: string[];
  joual_tagline: string;
  intensity_score: number;
}

export async function processGymIntel(rawContent: string): Promise<KineticIntel | null> {
  const genAI = getGemini();
  if (!genAI) return null;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are the lead brand strategist for KINETIC, a high-intensity, brutalist athletic platform based in Montreal.
    Your task is to take the following raw website content from a gym and transform it into a "Kinetic Manifesto".

    RULES:
    1. TONE: Aggressive, raw, unapologetic, industrial. Use short, punchy sentences.
    2. LANGUAGE: English for the manifesto, but provide a localized "Joual" tagline (Montreal street slang).
    3. CONTENT: Extract specific high-performance gear (amenities) and a powerful brand statement.
    4. INTENSITY: Assign an intensity score from 1-100 based on the gear and vibe.

    RAW CONTENT:
    ${rawContent}

    OUTPUT FORMAT (JSON):
    {
      "manifesto": "The brand statement in Kinetic voice",
      "amenities": ["List", "of", "high-performance", "gear"],
      "joual_tagline": "A short, punchy tagline in authentic Montreal Joual",
      "intensity_score": 85
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response (handling potential markdown blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error("Gemini processing failed:", error);
    return null;
  }
}
