import React from 'react';
import { X, FileText, CheckCircle, Info } from 'lucide-react';

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScriptModal: React.FC<ScriptModalProps> = ({ isOpen, onClose }) => {
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Administration Script & Procedure
              </h2>
              <p className="text-xs text-slate-500">
                Official UFLI Foundational Literacy Placement Guidelines
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
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
          {/* Verbal Script */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              Before Showing the Material, Say to Student:
            </h3>
            <div className="bg-emerald-50/80 border-2 border-emerald-200/80 rounded-2xl p-5 text-emerald-950 text-base leading-relaxed font-['Lexend'] shadow-xs">
              <p className="font-semibold text-lg mb-2 text-emerald-900">
                “Today, we are going to take a test to see where you are at in reading.”
              </p>
              <p className="text-emerald-900/90 leading-relaxed">
                “I’m going to show you some words to read. Some are real words and some are made-up words that may or may not be tricky to read, but please try your best. Remember that some are made-up words, so do not try to make them sound like real words. Ready?”
              </p>
            </div>
          </div>

          {/* Procedure */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Test Administration Instructions
            </h3>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <p>Start with <strong>Set 1</strong>. Ask the student to read aloud the words one by one.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <p>Each real and fake word read accurately is worth <strong>1 point</strong>.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <p>Use the <strong>Tutor Mode</strong> bar or keyboard shortcuts (<kbd className="px-1 rounded bg-slate-200 text-slate-800 font-mono text-[11px]">C</kbd> = Correct, <kbd className="px-1 rounded bg-slate-200 text-slate-800 font-mono text-[11px]">X</kbd> = Missed) to track their score live.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">4</span>
                <p>At the end of each set, check their score tally. Continue sequentially through <strong>Set 11</strong>.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">5</span>
                <p>Click <strong>Scores</strong> in the top header to copy or export your student’s tally for the UFLI form.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Students should never see labels indicating whether a word is real or made-up. Treat every word equally.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            Start Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
