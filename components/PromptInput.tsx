import React, { useState, useEffect } from 'react';
import { Wand2, XCircle } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  initialPrompt?: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading, initialPrompt = '' }) => {
  const [input, setInput] = useState(initialPrompt);

  // Update local state if initialPrompt changes (for Remix functionality)
  useEffect(() => {
    setInput(initialPrompt);
  }, [initialPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onGenerate(input.trim());
    }
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="w-full px-4 py-3 bg-slate-900 border-t border-slate-800 fixed bottom-0 left-0 right-0 z-20 pb-6 md:pb-4 safe-area-bottom">
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-3 max-w-md mx-auto">
        <div className="relative w-full">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예: 비 오는 서울 거리의 네온사인, 사이버펑크 스타일"
            className="w-full bg-slate-800 text-white placeholder-slate-400 border border-slate-700 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm min-h-[80px]"
            disabled={isLoading}
          />
          {input && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`
            flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white transition-all duration-200
            ${!input.trim() || isLoading 
              ? 'bg-slate-700 cursor-not-allowed opacity-70' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 active:scale-[0.98]'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>생성 중...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>배경화면 생성하기</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PromptInput;