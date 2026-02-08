import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { BookDetails, PromptResult, AspectRatio } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Step 1: Analyze book and generate prompts using Gemini 3 Flash Preview (Text)
 */
export const generateCoverPrompt = async (details: BookDetails): Promise<PromptResult> => {
  const { title, author, style, aspectRatio } = details;

  // CORRECTION: 3:4 is WIDER than 2:3. 
  // 3:4 = 0.75 width/height. 
  // 2:3 = 0.66 width/height.
  // Therefore, to get 2:3 from 3:4, we crop the SIDES (Left/Right).
  // CRITICAL UPDATE: Previous "safe margins" instruction caused AI to generate white borders. 
  // Changed to emphasize FULL BLEED and NO BORDERS.
  const compositionInstruction = aspectRatio === '2:3' 
    ? "**COMPOSITION CRITICAL - NO BORDERS**: The image will be cropped from 3:4 to 2:3. You MUST generate a **FULL BLEED** image where the artwork extends to all four edges. **DO NOT** add white borders, frames, or safe-area margins. Center the title and main subject horizontally to ensure they are safe from side cropping, but fill the side areas with background/texture."
    : `**COMPOSITION**: The final image will be generated in **${aspectRatio} aspect ratio**. Ensure the composition is optimized for this shape. **FULL BLEED, NO BORDERS**.`;

  const userPrompt = `
  Design Request: Create a book cover for "${title}" by ${author}.
  Preferred Style: ${style}.
  Target Aspect Ratio: ${aspectRatio}.
  
  Task:
  1. **SEARCH REQUIRED**: Use Google Search to find detailed information about this book.
  2. Act as the "Prompt Architect". Based on the book's themes, characters, and settings, create **3 DISTINCT visual concepts (Options)** for the cover.
     - Option 1: Focus on a key symbol or object (Metaphorical).
     - Option 2: Focus on a key scene or setting (Atmospheric).
     - Option 3: Focus on a character or emotional abstract (Character/Vibe).
  3. Adhere strictly to the aesthetic of the selected style: ${style}.
  4. **TEXT RENDERING**: The generated prompt MUST explicitly include specific instructions to render the text "${title}" (Title) and "${author}" (Author) on the cover. Describe the typography style (e.g., bold, serif, handwritten), color, and placement to match the design. **Ensure text is integrated into the full-bleed artwork, not placed in a white box or separated margin.**
  5. ${compositionInstruction}
  6. **LOCALIZATION**: Provide 'title' and 'rationale' in English, AND 'title_zh' and 'rationale_zh' in Chinese.
  7. Return the result in the requested JSON format containing the list of options.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Short catchy title in English" },
                  title_zh: { type: Type.STRING, description: "Short catchy title in Chinese" },
                  chinesePrompt: { type: Type.STRING },
                  englishPrompt: { type: Type.STRING },
                  rationale: { type: Type.STRING, description: "Design rationale in English" },
                  rationale_zh: { type: Type.STRING, description: "Design rationale in Chinese" },
                },
                required: ["title", "title_zh", "chinesePrompt", "englishPrompt", "rationale", "rationale_zh"]
              }
            }
          },
          required: ["options"]
        }
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No text response from Gemini.");

    const parsed = JSON.parse(resultText) as PromptResult;
    return parsed;

  } catch (error) {
    console.error("Error generating prompt:", error);
    throw new Error("Failed to analyze book and generate prompt.");
  }
};

/**
 * Step 2: Generate the image using Nano Banana (Gemini 2.5 Flash Image)
 */
export const generateCoverImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    // Map UI aspect ratios to API supported ratios
    // API supports: "1:1", "3:4", "4:3", "9:16", "16:9"
    // '2:3' is NOT supported, so we request '3:4' and rely on UI cropping
    let apiRatio = "1:1";
    switch (aspectRatio) {
      case '2:3':
      case '3:4':
        apiRatio = "3:4";
        break;
      case '1:1':
        apiRatio = "1:1";
        break;
      default:
        apiRatio = "1:1";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: apiRatio, 
        }
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) throw new Error("No candidates returned.");
    
    const parts = candidates[0].content.parts;
    let base64Image = "";

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        base64Image = part.inlineData.data;
        break;
      }
    }

    if (!base64Image) {
      throw new Error("No image data found in response.");
    }

    return `data:image/png;base64,${base64Image}`;

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate cover image.");
  }
};