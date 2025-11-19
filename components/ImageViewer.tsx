import React, { useEffect, useState } from 'react';
import { GeneratedImage } from '../types';
import { X, Download, RefreshCw, Check } from 'lucide-react';

interface ImageViewerProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onRemix: (prompt: string) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose, onRemix }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    if (image) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [image]);

  if (!image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${image.base64}`;
    link.download = `mobiwall-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
  };

  const handleRemix = () => {
    onRemix(image.prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-in fade-in duration-200">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/60 transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Container */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <img 
          src={`data:image/jpeg;base64,${image.base64}`} 
          alt="Full screen wallpaper"
          className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
        />
      </div>

      {/* Action Bar */}
      <div className="absolute bottom-8 left-0 right-0 px-6 flex justify-center gap-4">
        <button
          onClick={handleRemix}
          className="flex-1 max-w-[160px] flex items-center justify-center gap-2 bg-slate-800/80 backdrop-blur-md text-white py-3.5 rounded-2xl font-medium active:scale-95 transition-transform border border-white/10"
        >
          <RefreshCw className="w-5 h-5" />
          Remix
        </button>

        <button
          onClick={handleDownload}
          className={`flex-1 max-w-[160px] flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white active:scale-95 transition-all shadow-lg ${
            isDownloaded 
              ? 'bg-green-600' 
              : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          {isDownloaded ? (
            <>
              <Check className="w-5 h-5" />
              완료
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              다운로드
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;