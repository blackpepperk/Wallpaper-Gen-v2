import React, { useState } from 'react';
import { GeneratedImage, GenerationState } from './types';
import { generateWallpapers } from './services/geminiService';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageGrid from './components/ImageGrid';
import ImageViewer from './components/ImageViewer';
import EmptyState from './components/EmptyState';
import SettingsModal from './components/SettingsModal';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [promptText, setPromptText] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [status, setStatus] = useState<GenerationState>({
    isLoading: false,
    error: null,
  });

  const handleGenerate = async (prompt: string) => {
    setStatus({ isLoading: true, error: null });
    setPromptText(prompt);
    
    // Scroll to top to prepare for results
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const newImages = await generateWallpapers(prompt);
      setImages(newImages);
    } catch (error: any) {
      setStatus({ 
        isLoading: false, 
        error: error.message || "알 수 없는 오류가 발생했습니다." 
      });
    }
    // Explicitly set loading to false in all cases
    setStatus(prev => ({ ...prev, isLoading: false }));
  };

  const handleRemix = (prompt: string) => {
    setPromptText(prompt);
    // Focus is handled by the input component reacting to prop changes
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="w-full max-w-md mx-auto">
        
        {status.error && (
          <div className="mx-4 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{status.error}</p>
          </div>
        )}

        {images.length === 0 && !status.isLoading && !status.error ? (
          <EmptyState />
        ) : (
          <ImageGrid images={images} onSelect={setSelectedImage} />
        )}
        
        {/* Loading Skeleton for Grid */}
        {status.isLoading && (
           <div className="grid grid-cols-2 gap-3 p-4 w-full animate-pulse">
             {[...Array(4)].map((_, i) => (
               <div key={i} className="aspect-[9/16] bg-slate-800 rounded-xl" />
             ))}
           </div>
        )}

      </main>

      <PromptInput 
        onGenerate={handleGenerate} 
        isLoading={status.isLoading}
        initialPrompt={promptText}
      />

      <ImageViewer 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)} 
        onRemix={handleRemix}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default App;