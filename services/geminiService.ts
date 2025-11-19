import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWallpapers = async (prompt: string): Promise<GeneratedImage[]> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 4,
        aspectRatio: '9:16',
        outputMimeType: 'image/jpeg',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("이미지를 생성하지 못했습니다. 다른 설명으로 다시 시도해주세요.");
    }

    return response.generatedImages.map((img, index) => ({
      id: `gen-${Date.now()}-${index}`,
      base64: img.image.imageBytes,
      prompt: prompt,
      aspectRatio: '9:16'
    }));

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "이미지 생성 중 오류가 발생했습니다.");
  }
};