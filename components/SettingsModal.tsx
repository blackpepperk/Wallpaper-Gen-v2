import React, { useState } from 'react';
import { X, Key, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { validateConnection } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  if (!isOpen) return null;

  const handleChangeKey = async () => {
    try {
      // @ts-ignore - aistudio is injected by the environment
      if (window.aistudio && window.aistudio.openSelectKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setTestResult(null); // Reset test state on key change attempt
      } else {
        // Fallback or info if not in the expected environment
        alert("API Key 변경은 이 환경에서 지원되지 않거나 이미 설정되었습니다.");
      }
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const success = await validateConnection();
      setTestResult(success ? 'success' : 'error');
    } catch (e) {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            설정
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              API Key 관리
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google AI Studio API Key를 사용하여 이미지를 생성합니다.
              키는 브라우저 내부에 안전하게 암호화되어 저장됩니다.
            </p>
            
            <button
              onClick={handleChangeKey}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white text-sm font-medium transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Key className="w-4 h-4" />
              API Key 변경
            </button>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">연결 상태</span>
              {testResult === 'success' && (
                <span className="text-xs text-green-400 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                  <CheckCircle2 className="w-3 h-3" /> 연결됨
                </span>
              )}
            </div>
            
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className={`w-full py-3 px-4 rounded-xl text-white text-sm font-medium transition-all flex items-center justify-center gap-2
                ${isTesting 
                  ? 'bg-slate-800 cursor-wait opacity-80' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 active:scale-[0.98]'
                }`}
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  테스트 중...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  연결 테스트
                </>
              )}
            </button>

            {testResult === 'error' && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                연결 실패. API Key를 확인해주세요.
              </div>
            )}
             {testResult === 'success' && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400 text-xs animate-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                성공적으로 연결되었습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;