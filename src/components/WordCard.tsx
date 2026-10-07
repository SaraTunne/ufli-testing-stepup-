import React from 'react';
import { 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  VolumeX
} from 'lucide-react';
import { WordItem, WordSet } from '../data/wordSets';

interface WordCardProps {
  currentSet: WordSet;
  currentWord: WordItem;
  currentIndex: number;
  totalWords: number;
  isSpeaking: boolean;
  textCase: 'lower' | 'upper' | 'title';
  fontSize: 'normal' | 'large' | 'huge';
  onSpeak: () => void;
  onNext: () => void;
  onPrev: () => void;
  canPrev: boolean;
  canNext: boolean;
  encouragementText?: string;
}

export const WordCard: React.FC<WordCardProps> = ({
  currentSet,
  currentWord,
  currentIndex,
  totalWords,
  isSpeaking,
  textCase,
  fontSize,
  onSpeak,
  onNext,
  onPrev,
  canPrev,
  canNext,
  encouragementText,
}) => {
  // Format word text strictly based on textCase
  const formattedWord = React.useMemo(() => {
    const raw = currentWord.text;
    if (textCase === 'upper') return raw.toUpperCase();
    if (textCase === 'title') return raw.charAt(0).toUpperCase() + raw.slice(1);
    return raw.toLowerCase();
  }, [currentWord.text, textCase]);

  // Dynamic font sizing
  const fontSizeClasses = {
    normal: 'text-6xl sm:text-7xl md:text-8xl tracking-wide',
    large: 'text-7xl sm:text-8xl md:text-9xl tracking-wider',
    huge: 'text-8xl sm:text-9xl md:text-[10rem] tracking-widest',
  }[fontSize];

  const progressPercentage = Math.round(((currentIndex + 1) / totalWords) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Top Progress & Set Header */}
      <div className="w-full flex items-center justify-between px-2 mb-3 text-sm font-semibold text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            Set {currentSet.id}
          </span>
          <span className="hidden sm:inline text-xs text-slate-500 font-medium">
            {currentSet.title.split(':')[1]?.trim() || currentSet.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-slate-600 font-bold">
            Word {currentIndex + 1} of {totalWords}
          </span>
          <span className="text-xs text-slate-400">({progressPercentage}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden mb-6 p-0.5">
        <div 
          className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Flashcard */}
      <div className="relative w-full bg-white rounded-3xl border-4 border-amber-100/80 shadow-xl shadow-amber-900/5 p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center text-center transition-all">
        {/* Soft decorative background dots */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-amber-200/60" />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-sky-200/60" />
        <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-emerald-200/60" />
        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-purple-200/60" />

        {/* Mascot / Friendly Prompt Message */}
        {encouragementText && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{encouragementText}</span>
          </div>
        )}

        {/* Printed Word Display:
            Strictly NEVER displays whether word is real or nonsense! */}
        <div className="my-8 sm:my-12 flex items-center justify-center min-h-[140px] sm:min-h-[180px]">
          <span 
            className={`font-extrabold select-none transition-all duration-200 text-slate-900 font-['Lexend'] ${fontSizeClasses} ${
              isSpeaking ? 'scale-105 text-sky-600 drop-shadow-sm' : ''
            }`}
          >
            {formattedWord}
          </span>
        </div>

        {/* Listen Again / Say Word Centerpiece Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onSpeak}
            disabled={isSpeaking}
            className={`group relative px-8 py-4 sm:px-10 sm:py-4.5 rounded-full font-bold text-lg sm:text-xl flex items-center gap-3 transition-all transform active:scale-95 shadow-lg ${
              isSpeaking
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white ring-4 ring-amber-200 shadow-amber-500/30 animate-pulse'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5'
            }`}
            title="Listen to word pronunciation (Press Spacebar)"
          >
            <div className={`p-1.5 rounded-full ${isSpeaking ? 'bg-amber-400/40' : 'bg-white/20'}`}>
              <Volume2 className={`w-6 h-6 ${isSpeaking ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`} />
            </div>
            <span>{isSpeaking ? 'Reading Word...' : 'Say Word'}</span>
          </button>
          
          <span className="text-xs text-slate-400 font-medium">
            (or press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-200 text-[10px] font-mono">Space</kbd> to listen)
          </span>
        </div>
      </div>

      {/* Navigation Arrows & Controls */}
      <div className="w-full flex items-center justify-between gap-4 mt-6">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className={`flex-1 py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all border-2 ${
            canPrev
              ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm active:scale-98'
              : 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed opacity-60'
          }`}
          title="Go back to previous word (Left Arrow)"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <button
          onClick={onNext}
          className="flex-1 py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md shadow-sky-500/25 transition-all hover:-translate-y-0.5 active:scale-98"
          title="Advance to next word (Right Arrow)"
        >
          <span>{currentIndex === totalWords - 1 ? 'Finish Set' : 'Next Word'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
