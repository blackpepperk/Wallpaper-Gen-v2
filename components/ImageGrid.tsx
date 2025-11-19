import React from 'react';
import { GeneratedImage } from '../types';

interface ImageGridProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onSelect }) => {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 p-4 pb-40 w-full max-w-md mx-auto animate-fade-in">
      {images.map((img) => (
        <div 
          key={img.id} 
          className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg aspect-[9/16] bg-slate-800"
          onClick={() => onSelect(img)}
        >
          <img
            src={`data:image/jpeg;base64,${img.base64}`}
            alt={img.prompt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;