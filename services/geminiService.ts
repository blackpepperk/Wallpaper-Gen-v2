import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from "../types";

const STORAGE_KEY = "mobiwall_api_key_enc";

// Simple obfuscation for local storage (client-side only)
const encryptKey = (key: string): string => {
  try {
    return btoa(key);
  } catch (e) {
    return key;
  }
};

const decryptKey = (encryptedKey: string): string => {
  try {
    return atob(encryptedKey);
  } catch (e) {
    return encryptedKey;
  }
};

export const saveApiKey = (key: string) => {
  if (!key) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, encryptKey(key));
};

export const getStoredApiKey = (): string | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? decryptKey(stored) : null;
};

// Get the best available key, prioritizing local user storage
const getActiveKey = (tempKey?: string): string => {
  if (tempKey) return tempKey;
  
  const stored = getStoredApiKey();
  if (stored) return stored;
  
  // Fallback to env if available, but user prefers external management
  return process.env.API_KEY || "";
};

const getAI = (specificKey?: string) => {
  const apiKey = getActiveKey(specificKey);
  if (!apiKey) {
    throw new Error("API Key가 없습니다. 설정에서 Key를 등록해주세요.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWallpapers = async (prompt: string): Promise<GeneratedImage[]> => {
  try {
    const ai = getAI();
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
    const msg = error.message || "이미지 생성 중 오류가 발생했습니다.";
    if (msg.includes("API key")) {
        throw new Error("API Key 오류입니다. 설정을 확인해주세요.");
    }
    throw new Error(msg);
  }
};

export const validateConnection = async (testKey?: string): Promise<boolean> => {
  try {
    const ai = getAI(testKey);
    // Perform a lightweight check using a text model
    await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'test',
    });
    return true;
  } catch (error) {
    console.error("Connection validation failed:", error);
    return false;
  }
};