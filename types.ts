export interface GeneratedImage {
  id: string;
  base64: string;
  prompt: string;
  aspectRatio: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
}

export type AspectRatio = '9:16'; // Enforcing vertical for mobile wallpapers as requested
