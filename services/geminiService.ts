
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';
import { WaterDataForGemini } from '../types';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const parseJsonFromMarkdown = (text: string): any => {
  const cleanedText = text.replace(/^```json\s*|```\s*$/g, '').trim();
  try {
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("Failed to parse JSON from response:", e, "Raw text:", text);
    // Fallback to return the raw text if it's not valid JSON,
    // or handle error as appropriate for your application
    return { error: "Invalid JSON response", details: text };
  }
};


export const getWaterSavingTip = async (): Promise<string> => {
  if (!ai) return "Funcionalidade de IA desabilitada. API Key não configurada.";
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: "Forneça uma dica concisa de economia de água para moradores de condomínios no Brasil. A dica deve ser prática, fácil de implementar e em português brasileiro.",
        // config: { thinkingConfig: { thinkingBudget: 0 } } // For faster, potentially less nuanced, response
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching water saving tip from Gemini:", error);
    return "Não foi possível buscar dicas de economia de água no momento. Tente novamente mais tarde.";
  }
};

export const getConsumptionAnalysis = async (data: WaterDataForGemini): Promise<string> => {
    if (!ai) return "Funcionalidade de IA desabilitada. API Key não configurada.";
    try {
        const prompt = `
        Você é um assistente especializado em análise de consumo de água para condomínios.
        Analise os seguintes dados de consumo de água de um condomínio (em m³):
        - Consumo total do mês atual: ${data.currentMonthTotal.toFixed(2)} m³
        - Consumo total do mês anterior: ${data.previousMonthTotal.toFixed(2)} m³
        - Média diária de consumo no mês atual: ${data.averageDaily.toFixed(2)} m³

        Com base nesses dados:
        1. Forneça um breve insight (1-2 frases) sobre o padrão de consumo: compare o consumo atual com o mês anterior (aumento, diminuição, estabilidade).
        2. Sugira uma dica de economia de água acionável e relevante para este contexto condominial.

        Responda em português brasileiro, de forma clara e concisa. Use no máximo 50 palavras para o insight e 50 palavras para a dica.
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching consumption analysis from Gemini:", error);
        return "Não foi possível analisar os dados de consumo no momento. Tente novamente mais tarde.";
    }
};
