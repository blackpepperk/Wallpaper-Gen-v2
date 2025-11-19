import React from 'react';
import { Smartphone } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center text-slate-400">
      <div className="bg-slate-800/50 p-6 rounded-full mb-6">
        <Smartphone className="w-12 h-12 text-slate-500" />
      </div>
      <h2 className="text-lg font-semibold text-white mb-2">나만의 배경화면 만들기</h2>
      <p className="text-sm max-w-xs mx-auto leading-relaxed">
        원하는 분위기나 장면을 설명하면<br/>
        AI가 4가지 스타일의 배경화면을 만들어드려요.
      </p>
      
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <span className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700">#몽환적인</span>
        <span className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700">#네온</span>
        <span className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700">#자연풍경</span>
        <span className="px-3 py-1 bg-slate-800 rounded-full text-xs border border-slate-700">#일러스트</span>
      </div>
    </div>
  );
};

export default EmptyState;