import { GoogleGenAI, Type } from "@google/genai";
import { SavingsPlan } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is assumed to be available in this environment.
// Note: VITE_GEMINI_API_KEY should be defined in .env.local
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Generates a personalized savings plan using Gemini 3 Flash.
 */
export const getSavingsAdvice = async (goal: string, amount: number, income: string): Promise<SavingsPlan> => {
  const modelId = "gemini-3-flash-preview";

  const prompt = `
    I want to save ${amount} (Indian Rupees ₹) for ${goal}. My current income situation is: ${income}.
    Create a practical, step-by-step savings plan suitable for an Indian user.
    Ensure all monetary values in the advice are in Rupees (₹).
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedTime: { type: Type.STRING },
            motivationalQuote: { type: Type.STRING }
          },
          required: ["title", "steps", "estimatedTime", "motivationalQuote"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as SavingsPlan;
  } catch (error) {
    console.error("Error fetching savings advice:", error);
    throw error;
  }
};

/**
 * Generates a custom Piggy Bank image using Gemini 2.5 Flash Image.
 */
export const generatePiggyBankImage = async (styleDescription: string): Promise<string> => {
  const modelId = "gemini-2.5-flash-image";
  const prompt = `A cute 3D icon of a piggy bank, style: ${styleDescription}.
  CRITICAL REQUIREMENTS:
  1. Front view, symmetrical, facing camera directly.
  2. Isolated on a transparent background (NO BACKGROUND). Do not include any background scenery, shadows, or colors.
  3. The material should look like ${styleDescription} (e.g., glass, gold, ceramic).
  4. Must show coins or wealth inside or around it if transparent.
  5. High contrast, colorful, suitable for a mobile app avatar.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    // Extract image from response parts
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Generates a financial insight based on user stats using Gemini 3 Flash.
 */
export const getFinancialInsight = async (
  totalBalance: string,
  monthlySavings: string,
  goalsSummary: string
): Promise<{ insight: string; suggestion: string; actionLabel: string }> => {
  const modelId = "gemini-3-flash-preview";
  const prompt = `
    I am a user of a savings app.
    Total Balance: ${totalBalance}
    Monthly Savings: ${monthlySavings}
    Goals: ${goalsSummary}
    
    Generate a financial insight and a specific next best action.
    The insight should be encouraging (max 20 words).
    The suggestion should be a concrete step (max 10 words).
    The actionLabel should be a button text (max 3 words).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insight: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            actionLabel: { type: Type.STRING }
          },
          required: ["insight", "suggestion", "actionLabel"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching insight:", error);
    return {
      insight: "You're doing great! Keep building that momentum.",
      suggestion: "Add ₹500 to your Emergency Fund today.",
      actionLabel: "Add Funds"
    };
  }
};