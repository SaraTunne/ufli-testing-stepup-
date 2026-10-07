import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { playCelebrationFanfare } from '../utils/speech';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  setId: number;
  isFinalSet: boolean;
  onNextSet: () => void;
  onReplaySet: () => void;
  scoreTally?: { correct: number; total: number };
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  setId,
  isFinalSet,
  onNextSet,
  onReplaySet,
  scoreTally,
}) => {
  useEffect(() => {
    if (isOpen) {
      playCelebrationFanfare();

      // Trigger colorful kid-friendly confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-200 p-6 sm:p-8 text-center flex flex-col items-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-amber-900 shadow-xl shadow-amber-400/30 mb-5 animate-bounce">
          {isFinalSet ? <Trophy className="w-10 h-10 text-amber-800" /> : <Award className="w-10 h-10 text-amber-800" />}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>{isFinalSet ? 'Test Completed!' : 'Set Completed!'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Fredoka']">
          {isFinalSet ? 'Sensational Job!' : `Great Work on Set ${setId}!`}
        </h2>

        <p className="text-sm text-slate-600 mt-2 mb-6">
          {isFinalSet
            ? 'You have completed all 11 reading sets of the placement test!'
            : 'You read through every word in this set like a reading champion!'}
        </p>

        {scoreTally && (
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-6">
            <span className="text-xs text-slate-500 font-medium">Tutor Recorded Score</span>
            <div className="text-xl font-black text-slate-800">
              {scoreTally.correct} / {scoreTally.total} correct
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-2.5">
          {!isFinalSet ? (
            <button
              onClick={() => {
                onNextSet();
                onClose();
              }}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-base bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Continue to Set {setId + 1}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all"
            >
              View Full Placement Summary
            </button>
          )}

          <button
            onClick={() => {
              onReplaySet();
              onClose();
            }}
            className="w-full py-3 px-6 rounded-2xl font-semibold text-sm text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Set {setId} Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
