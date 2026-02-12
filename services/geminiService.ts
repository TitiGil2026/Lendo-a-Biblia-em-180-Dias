
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDailyReflection(readingsText: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Com base nas leituras bíblicas de hoje: ${readingsText}. 
      Por favor, forneça uma breve reflexão devocional (em Português), uma oração sugerida e uma "palavra de incentivo" para o usuário.
      Mantenha um tom encorajador, sábio e acolhedor.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI reflection:", error);
    return "Que a paz de Deus acompanhe sua leitura hoje. Continue firme em seu propósito!";
  }
}

export async function getSpiritualAdvice(question: string, context: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Usuário está lendo a Bíblia no plano de 180 dias. Contexto atual: ${context}. 
      Pergunta do usuário: "${question}".
      Responda de forma bíblica, pastoral e encorajadora.`,
    });
    return response.text;
  } catch (error) {
    return "Desculpe, tive um problema ao processar sua pergunta. Tente novamente em instantes.";
  }
}
