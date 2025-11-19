import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, AlertCircle, Loader2, Save, Trash2 } from 'lucide-react';
import { validateConnection, saveApiKey, getStoredApiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [inputKey, setInputKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredApiKey();
      if (stored) {
        setInputKey(stored);
      }
      setStatus('idle');
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    if (!inputKey.trim()) {
      setStatus('error');
      setStatusMessage('API Key를 입력해주세요.');
      return;
    }

    setIsTesting(true);
    setStatus('idle');
    
    try {
      // 1. Test connection first
      const success = await validateConnection(inputKey.trim());
      
      if (success) {
        // 2. If success, save to local storage
        saveApiKey(inputKey.trim());
        setStatus('success');
        setStatusMessage('연결 성공! 키가 안전하게 저장되었습니다.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setStatus('error');
        setStatusMessage('연결 실패. 유효하지 않은 API Key입니다.');
      }
    } catch (e) {
      setStatus('error');
      setStatusMessage('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearKey = () => {
    saveApiKey('');
    setInputKey('');
    setStatus('idle');
    setStatusMessage('저장된 키가 삭제되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            API Key 설정
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
            <label className="block text-sm font-medium text-slate-300">
              Gemini API Key 입력
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AI Studio API Key를 입력하세요"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              입력하신 키는 브라우저 내부 저장소(LocalStorage)에 암호화되어 저장되며, 서버로 전송되지 않습니다.
            </p>
          </div>

          {status !== 'idle' && (
            <div className={`p-3 rounded-lg flex items-start gap-2 text-xs animate-in slide-in-from-top-2 border ${
              status === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
             {inputKey && (
              <button
                onClick={handleClearKey}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                title="키 삭제"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleSaveAndTest}
              disabled={isTesting}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-bold transition-all
                ${isTesting 
                  ? 'bg-slate-700 cursor-wait opacity-80' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 active:scale-[0.98]'
                }`}
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  연결 테스트 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  저장 및 연결 테스트
                </>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              API Key 발급받기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;