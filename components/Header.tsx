import React from 'react';
import { Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="w-full p-4 flex items-center justify-between bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          AI 배경화면 메이커
        </h1>
      </div>
      <button
        onClick={onOpenSettings}
        className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5 active:scale-95"
        aria-label="설정"
      >
        <Settings className="w-6 h-6" />
      </button>
    </header>
  );
};

export default Header;