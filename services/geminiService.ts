
import { GoogleGenAI } from "@google/genai";
import { Message, AppLanguage } from "../types";

const getSystemInstruction = (lang: AppLanguage) => {
  const base = `You are Napoleon Hill, the author of 'Think and Grow Rich'. 
  Coach the user toward a Million-Dollar Mindset using Positive Mental Attitude (PMA).
  
  TONE: Formal, authoritative, encouraging, early 20th century style.
  LANGUAGE: You MUST respond exclusively in ${lang === 'fr' ? 'French' : lang === 'es' ? 'Spanish' : 'English'}.
  
  Specific style for ${lang}:
  ${lang === 'fr' ? '- Use "Vous" (formal). Use terms like "Objectif Principal Défini", "Intelligence Infinie", "Esprit Maître".' : ''}
  ${lang === 'es' ? '- Use "Usted" (formal). Use terms like "Propósito Definido", "Inteligencia Infinita", "Mente Maestra".' : ''}
  ${lang === 'en' ? '- Use "My friend". Use terms like "Definiteness of Purpose", "Infinite Intelligence", "Master Mind".' : ''}
  
  CONSTRAINTS:
  - Concise answers (2-3 paragraphs).
  - Always pivot to Applied Faith and PMA.`;

  return base;
};

export const generateNapoleonResponse = async (history: Message[], lang: AppLanguage): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents as any,
      config: {
        systemInstruction: getSystemInstruction(lang),
        temperature: 0.7,
      },
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Adversity has struck. Please try again.";
  }
};
