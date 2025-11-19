import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 flex items-center justify-center space-x-2 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
      <div className="bg-indigo-600 p-1.5 rounded-lg">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
        AI 배경화면 메이커
      </h1>
    </header>
  );
};

export default Header;