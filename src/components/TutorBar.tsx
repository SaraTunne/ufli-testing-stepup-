import React from 'react';
import { Check, X, ShieldAlert, Award } from 'lucide-react';
import { WordItem } from '../data/wordSets';

interface TutorBarProps {
  currentWord: WordItem;
  currentWordScore?: boolean;
  realScore: number;
  totalReal: number;
  nonsenseScore: number;
  totalNonsense: number;
  onScore: (isCorrect: boolean) => void;
  onClearScore: () => void;
}

export const TutorBar: React.FC<TutorBarProps> = ({
  currentWord,
  currentWordScore,
  realScore,
  totalReal,
  nonsenseScore,
  totalNonsense,
  onScore,
  onClearScore,
}) => {
  const totalCorrect = realScore + nonsenseScore;
  const totalTested = totalReal + totalNonsense;

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-800 transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
        {/* Tutor Reference Details */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            TUTOR EVALUATION
          </span>
          <span className="text-slate-300">
            Target Type: <strong className={currentWord.type === 'real' ? 'text-emerald-400' : 'text-amber-400'}>
              {currentWord.type === 'real' ? 'Real Word' : 'Nonsense / Pseudo Word'}
            </strong>
          </span>
          {currentWord.rhymesWith && (
            <span className="hidden md:inline text-slate-400">
              (Rhymes with: {currentWord.rhymesWith})
            </span>
          )}
        </div>

        {/* Live Set Scoring Tally */}
        <div className="flex items-center gap-3 font-semibold text-slate-300">
          <span>Real: <strong className="text-white">{realScore}/{totalReal}</strong></span>
          <span>·</span>
          <span>Nonsense: <strong className="text-white">{nonsenseScore}/{totalNonsense}</strong></span>
          <span>·</span>
          <span className="text-amber-300">Set Total: <strong>{totalCorrect}/{totalTested}</strong></span>
        </div>
      </div>

      {/* Scoring Buttons */}
      <div className="flex items-center gap-3 pt-3">
        <button
          onClick={() => onScore(true)}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            currentWordScore === true
              ? 'bg-emerald-500 text-white ring-4 ring-emerald-400/40 shadow-lg shadow-emerald-500/30'
              : 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40'
          }`}
          title="Mark correct (Press C key)"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>Correct (1 pt)</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-emerald-950/60 text-[10px] text-emerald-200 border border-emerald-700/50">C</kbd>
        </button>

        <button
          onClick={() => onScore(false)}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            currentWordScore === false
              ? 'bg-rose-500 text-white ring-4 ring-rose-400/40 shadow-lg shadow-rose-500/30'
              : 'bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40'
          }`}
          title="Mark incorrect (Press X key)"
        >
          <X className="w-5 h-5 stroke-[3]" />
          <span>Missed (0 pt)</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-rose-950/60 text-[10px] text-rose-200 border border-rose-700/50">X</kbd>
        </button>

        {currentWordScore !== undefined && (
          <button
            onClick={onClearScore}
            className="py-3 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset score for this word"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
