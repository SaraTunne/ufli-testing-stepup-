import React, { useState, useEffect } from 'react';
import { X, Volume2, Type, Sliders, Sparkles, Download, Play } from 'lucide-react';
import { getAvailableVoices, speakPhoneticWord } from '../utils/speech';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  speechRate: number;
  onChangeSpeechRate: (rate: number) => void;
  selectedVoiceURI: string;
  onChangeVoiceURI: (uri: string) => void;
  textCase: 'lower' | 'upper' | 'title';
  onChangeTextCase: (textCase: 'lower' | 'upper' | 'title') => void;
  fontSize: 'normal' | 'large' | 'huge';
  onChangeFontSize: (size: 'normal' | 'large' | 'huge') => void;
  soundEffects: boolean;
  onChangeSoundEffects: (enabled: boolean) => void;
  onDownloadStandalone: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  speechRate,
  onChangeSpeechRate,
  selectedVoiceURI,
  onChangeVoiceURI,
  textCase,
  onChangeTextCase,
  fontSize,
  onChangeFontSize,
  soundEffects,
  onChangeSoundEffects,
  onDownloadStandalone,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const v = getAvailableVoices();
      setVoices(v);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          setVoices(getAvailableVoices());
        };
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    setIsTestingVoice(true);
    speakPhoneticWord('Ready to read and blend words!', undefined, {
      rate: speechRate,
      voiceURI: selectedVoiceURI,
      onEnd: () => setIsTestingVoice(false),
      onError: () => setIsTestingVoice(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Audio & Display Settings
              </h2>
              <p className="text-xs text-slate-500">
                Customize speech synthesizer, typography, and test preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Speech Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-sky-600" />
                Speech Synthesis Speed
              </label>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                {speechRate.toFixed(2)}x (Recommended: 0.85x)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '🐢 0.70x (Slow)', value: 0.7 },
                { label: '⭐ 0.85x (Warm / Clear)', value: 0.85 },
                { label: '🐇 1.00x (Normal)', value: 1.0 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChangeSpeechRate(opt.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    Math.abs(speechRate - opt.value) < 0.01
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
              Speech Synthesis Voice
            </label>
            <div className="flex gap-2">
              <select
                value={selectedVoiceURI}
                onChange={(e) => onChangeVoiceURI(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                <option value="">Default Recommended Voice (Warm Child-Friendly en-US)</option>
                {voices
                  .filter((v) => v.lang.startsWith('en'))
                  .map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
              </select>
              <button
                onClick={handleTestVoice}
                disabled={isTestingVoice}
                className="px-3 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test</span>
              </button>
            </div>
          </div>

          {/* Text Letter-Casing */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2">
              <Type className="w-4 h-4 text-emerald-600" />
              Word Letter Casing
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'lowercase (Standard)', value: 'lower' },
                { label: 'UPPERCASE (K-1)', value: 'upper' },
                { label: 'Title Case', value: 'title' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChangeTextCase(opt.value as 'lower' | 'upper' | 'title')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    textCase === opt.value
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card Font Size */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
              Word Card Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Normal Size', value: 'normal' },
                { label: 'Large Font', value: 'large' },
                { label: 'Huge Font', value: 'huge' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChangeFontSize(opt.value as 'normal' | 'large' | 'huge')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    fontSize === opt.value
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Sound Effects</span>
              <span className="text-[11px] text-slate-500">Play pleasant chimes on scoring and completion</span>
            </div>
            <button
              onClick={() => onChangeSoundEffects(!soundEffects)}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                soundEffects ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Download Standalone File */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-900 block">Download Standalone HTML</span>
                <span className="text-[11px] text-amber-700 leading-normal block mt-0.5">
                  Get a single-file offline version containing all 11 sets, phonetic synthesis, and scoring tools to use anywhere without internet.
                </span>
              </div>
              <button
                onClick={onDownloadStandalone}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save HTML</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-900 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
