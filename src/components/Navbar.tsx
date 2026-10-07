import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Settings, 
  FileText, 
  UserCheck, 
  BarChart3, 
  Download,
  Volume2
} from 'lucide-react';

interface NavbarProps {
  currentSetId: number;
  totalSets: number;
  totalStars: number;
  isTutorMode: boolean;
  onToggleTutorMode: () => void;
  onOpenScript: () => void;
  onOpenReport: () => void;
  onOpenSettings: () => void;
  onOpenSetSelector: () => void;
  onDownloadStandalone: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSetId,
  totalSets,
  totalStars,
  isTutorMode,
  onToggleTutorMode,
  onOpenScript,
  onOpenReport,
  onOpenSettings,
  onOpenSetSelector,
  onDownloadStandalone,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Set Button */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-800 text-base sm:text-lg tracking-tight">
                Reading Placement
              </h1>
              <button
                onClick={onOpenSetSelector}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors border border-sky-200"
                title="Change Set"
              >
                Set {currentSetId} of {totalSets}
                <span className="text-[10px] text-sky-500">▼</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              UFLI Foundational Literacy Assessment (Sets 1–11)
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Star streak */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs sm:text-sm"
            title="Stars earned for reading words"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{totalStars}</span>
          </div>

          {/* Quick Set selector for mobile */}
          <button
            onClick={onOpenSetSelector}
            className="sm:hidden px-2.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200"
          >
            Set {currentSetId}
          </button>

          {/* Tutor Mode Toggle */}
          <button
            onClick={onToggleTutorMode}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center gap-1.5 ${
              isTutorMode
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
            title="Toggle scoring and tracking panel for tutors"
          >
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Tutor Mode:</span>
            <span>{isTutorMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Teacher Script Button */}
          <button
            onClick={onOpenScript}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            title="View administration script"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Script</span>
          </button>

          {/* Score Report Button */}
          {isTutorMode && (
            <button
              onClick={onOpenReport}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-violet-50 text-violet-800 border border-violet-200 hover:bg-violet-100 transition-colors flex items-center gap-1.5"
              title="View full scores summary sheet"
            >
              <BarChart3 className="w-4 h-4 text-violet-600" />
              <span className="hidden md:inline">Scores</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Audio & display settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Download Standalone Single HTML */}
          <button
            onClick={onDownloadStandalone}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors"
            title="Export full single-file HTML for offline test administration"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span>Save Offline HTML</span>
          </button>
        </div>
      </div>
    </header>
  );
};
