import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DiagnosisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isMRI: {
      type: Type.BOOLEAN,
      description: "Whether the image is a valid medical MRI scan of a brain. Set to false for photos, drawings, animals, or non-brain MRIs.",
    },
    hasTumor: {
      type: Type.BOOLEAN,
      description: "If isMRI is true, does the scan likely show a brain tumor? If isMRI is false, this must be false.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "A confidence score between 0 and 100 representing certainty of the diagnosis.",
    },
    reasoning: {
      type: Type.STRING,
      description: "A short, professional medical explanation of the findings (max 2 sentences). If not an MRI, explain why.",
    },
  },
  required: ["isMRI", "hasTumor", "confidence", "reasoning"],
};

export const analyzeMRI = async (base64Image: string, mimeType: string): Promise<DiagnosisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `Analyze this image for BrainGuard AI. 
            1. First, strictly verify if this is a grayscale brain MRI scan. Real-world photos, selfies, colored diagrams, or non-medical images must be flagged as isMRI: false.
            2. If it is a valid MRI, detect if there are anomalies indicating a brain tumor.
            3. Provide a confidence score and brief medical reasoning.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert radiologist AI assistant named BrainGuard. You are highly conservative and precise. You strictly reject non-MRI images.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as DiagnosisResult;
    return result;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};