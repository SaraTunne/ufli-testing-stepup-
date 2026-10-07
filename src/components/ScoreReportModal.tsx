import React, { useState } from 'react';
import { X, Copy, Check, Download, RotateCcw, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { WORD_SETS } from '../data/wordSets';

interface ScoreReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: Record<string, boolean>;
  onResetAllScores: () => void;
}

export const ScoreReportModal: React.FC<ScoreReportModalProps> = ({
  isOpen,
  onClose,
  scores,
  onResetAllScores,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate detailed summary per set
  const setSummaries = WORD_SETS.map((set) => {
    let realTested = 0;
    let realCorrect = 0;
    let nonsenseTested = 0;
    let nonsenseCorrect = 0;

    set.words.forEach((w) => {
      const res = scores[w.id];
      if (w.type === 'real') {
        if (res !== undefined) {
          realTested++;
          if (res) realCorrect++;
        }
      } else {
        if (res !== undefined) {
          nonsenseTested++;
          if (res) nonsenseCorrect++;
        }
      }
    });

    const totalWords = set.words.length;
    const realTotal = set.words.filter((w) => w.type === 'real').length;
    const nonsenseTotal = set.words.filter((w) => w.type === 'nonsense').length;
    const totalTested = realTested + nonsenseTested;
    const totalCorrect = realCorrect + nonsenseCorrect;
    const accuracy = totalTested > 0 ? Math.round((totalCorrect / totalTested) * 100) : 0;
    const isMastered = accuracy >= 80 && totalTested === totalWords;

    return {
      set,
      realCorrect,
      realTotal,
      realTested,
      nonsenseCorrect,
      nonsenseTotal,
      nonsenseTested,
      totalCorrect,
      totalWords,
      totalTested,
      accuracy,
      isMastered,
      isComplete: totalTested === totalWords,
    };
  });

  // Calculate overall assessment totals
  const overallTested = setSummaries.reduce((acc, s) => acc + s.totalTested, 0);
  const overallCorrect = setSummaries.reduce((acc, s) => acc + s.totalCorrect, 0);
  const overallTotal = setSummaries.reduce((acc, s) => acc + s.totalWords, 0);

  // Suggested instructional starting point: first set where mastery was not attained (<80% or incomplete)
  const firstStruggleSet = setSummaries.find((s) => s.totalTested > 0 && s.accuracy < 80);

  const handleCopyReport = () => {
    let text = `=== UFLI FOUNDATIONAL LITERACY PLACEMENT TEST REPORT ===\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n`;
    text += `Total Words Tested: ${overallTested} / ${overallTotal}\n`;
    text += `Total Correct: ${overallCorrect} (${overallTested > 0 ? Math.round((overallCorrect / overallTested) * 100) : 0}%)\n\n`;
    text += `SET BREAKDOWN (Real Words | Made-up Words | Total):\n`;
    text += `--------------------------------------------------------\n`;

    setSummaries.forEach((s) => {
      text += `Set ${s.set.id}: Real: ${s.realCorrect}/${s.realTotal} | Made-up: ${s.nonsenseCorrect}/${s.nonsenseTotal} | Total: ${s.totalCorrect}/${s.totalWords} (${s.accuracy}%)\n`;
    });

    if (firstStruggleSet) {
      text += `\nRecommended Starting Point: Set ${firstStruggleSet.set.id} (${firstStruggleSet.set.focus})\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCsv = () => {
    let csv = `Set,Title,GradeLevel,RealCorrect,RealTotal,NonsenseCorrect,NonsenseTotal,TotalCorrect,TotalWords,AccuracyPercent,Mastered\n`;
    setSummaries.forEach((s) => {
      csv += `${s.set.id},"${s.set.title}","${s.set.gradeLevel}",${s.realCorrect},${s.realTotal},${s.nonsenseCorrect},${s.nonsenseTotal},${s.totalCorrect},${s.totalWords},${s.accuracy}%,${s.isMastered ? 'Yes' : 'No'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ufli-reading-placement-scores-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                UFLI Placement Score Summary
              </h2>
              <p className="text-xs text-slate-500">
                Complete tally for submitting into the UFLI Placement Score Form
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Top Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-100">
              <span className="text-xs font-semibold text-violet-700 uppercase">Words Tested</span>
              <p className="text-2xl font-extrabold text-violet-950 mt-1">
                {overallTested} <span className="text-sm font-medium text-violet-600">/ {overallTotal}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-700 uppercase">Total Correct</span>
              <p className="text-2xl font-extrabold text-emerald-950 mt-1">
                {overallCorrect}{' '}
                <span className="text-sm font-medium text-emerald-600">
                  ({overallTested > 0 ? Math.round((overallCorrect / overallTested) * 100) : 0}%)
                </span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
              <span className="text-xs font-semibold text-amber-700 uppercase">Placement Recommendation</span>
              <p className="text-sm font-bold text-amber-950 mt-1">
                {firstStruggleSet 
                  ? `Start Lesson at Set ${firstStruggleSet.set.id}`
                  : overallTested === overallTotal 
                  ? 'All 11 Sets Mastered (≥80%)'
                  : 'Assessment In Progress'}
              </p>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Set</th>
                    <th className="py-3 px-4">Skill Focus</th>
                    <th className="py-3 px-3 text-center">Real Words</th>
                    <th className="py-3 px-3 text-center">Made-up Words</th>
                    <th className="py-3 px-3 text-center">Set Total</th>
                    <th className="py-3 px-3 text-center">Accuracy</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {setSummaries.map((s) => (
                    <tr key={s.set.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        Set {s.set.id}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-medium text-slate-800">{s.set.title.split(':')[1]?.trim() || s.set.title}</div>
                        <div className="text-[11px] text-slate-400">{s.set.gradeLevel}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">
                        {s.realCorrect} / {s.realTotal}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">
                        {s.nonsenseCorrect} / {s.nonsenseTotal}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">
                        {s.totalCorrect} / {s.totalWords}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-bold ${
                          s.accuracy >= 80 ? 'text-emerald-600' : s.totalTested > 0 ? 'text-amber-600' : 'text-slate-400'
                        }`}>
                          {s.totalTested > 0 ? `${s.accuracy}%` : '—'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {s.isMastered ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Mastered
                          </span>
                        ) : s.totalTested > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" /> Review
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Not started</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all tracked scores?')) {
                onResetAllScores();
              }
            }}
            className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Scores
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </button>

            <button
              onClick={handleCopyReport}
              className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy for UFLI Form'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
