import React from 'react';
import { X, CheckCircle, ChevronRight, Layers } from 'lucide-react';
import { WORD_SETS } from '../data/wordSets';

interface SetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSetId: number;
  onSelectSet: (setId: number) => void;
  scores: Record<string, boolean>;
}

export const SetSelectorModal: React.FC<SetSelectorModalProps> = ({
  isOpen,
  onClose,
  currentSetId,
  onSelectSet,
  scores,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Placement Test Sets (1 – 11)
              </h2>
              <p className="text-xs text-slate-500">
                Jump directly to any level of the reading assessment
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

        {/* Set list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5">
          {WORD_SETS.map((set) => {
            const isSelected = set.id === currentSetId;
            
            // Calculate set completed count
            let answered = 0;
            let correct = 0;
            set.words.forEach((w) => {
              if (scores[w.id] !== undefined) {
                answered++;
                if (scores[w.id]) correct++;
              }
            });
            const isFinished = answered === set.words.length;

            return (
              <button
                key={set.id}
                onClick={() => {
                  onSelectSet(set.id);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                    : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? 'bg-sky-500 text-white'
                        : isFinished
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {set.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {set.title}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-200 text-sky-800 text-[10px] font-bold">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {set.focus} · <span className="font-medium text-slate-600">{set.gradeLevel}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {answered > 0 ? (
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700">
                        {correct} / {set.words.length}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {isFinished ? 'Completed' : `${answered} tested`}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">
                      {set.words.length} words
                    </span>
                  )}
                  <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-sky-500' : 'text-slate-300'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
