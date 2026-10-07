import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WORD_SETS, WordItem, WordSet } from './data/wordSets';
import { 
  speakPhoneticWord, 
  stopSpeaking, 
  playChimeSound, 
  playCorrectSound,
  getPhoneticSpelling
} from './utils/speech';
import { generateStandaloneHtml } from './utils/standaloneHtml';
import { Navbar } from './components/Navbar';
import { WordCard } from './components/WordCard';
import { TutorBar } from './components/TutorBar';
import { SetSelectorModal } from './components/SetSelectorModal';
import { ScoreReportModal } from './components/ScoreReportModal';
import { ScriptModal } from './components/ScriptModal';
import { SettingsModal } from './components/SettingsModal';
import { CelebrationModal } from './components/CelebrationModal';

const ENCOURAGEMENTS = [
  '🌟 Great reading!',
  '🚀 Sounding it out!',
  '🎉 Wonderful job!',
  '✨ Keep shining!',
  '⭐ Super reader!',
  '⚡ Fantastic blend!',
];

export default function App() {
  // Navigation State
  const [currentSetId, setCurrentSetId] = useState<number>(1);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  // Audio & Speech State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.85); // Critical requirement: rate 0.85
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [soundEffects, setSoundEffects] = useState<boolean>(true);

  // Display State
  const [textCase, setTextCase] = useState<'lower' | 'upper' | 'title'>('lower');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');

  // Gamification & Tutor State
  const [totalStars, setTotalStars] = useState<number>(0);
  const [isTutorMode, setIsTutorMode] = useState<boolean>(false);
  const [scores, setScores] = useState<Record<string, boolean>>({});
  const [encouragement, setEncouragement] = useState<string>('');

  // Modals
  const [isScriptOpen, setIsScriptOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isSetSelectorOpen, setIsSetSelectorOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);

  // Current Set & Word References
  const currentSet: WordSet = useMemo(() => {
    return WORD_SETS.find((s) => s.id === currentSetId) || WORD_SETS[0];
  }, [currentSetId]);

  const currentWord: WordItem = useMemo(() => {
    return currentSet.words[currentWordIndex] || currentSet.words[0];
  }, [currentSet, currentWordIndex]);

  // Tutor Live Score Statistics for the active set
  const { realScore, totalReal, nonsenseScore, totalNonsense } = useMemo(() => {
    let rScore = 0;
    let rTotal = 0;
    let nScore = 0;
    let nTotal = 0;

    currentSet.words.forEach((w) => {
      const res = scores[w.id];
      if (w.type === 'real') {
        rTotal++;
        if (res === true) rScore++;
      } else {
        nTotal++;
        if (res === true) nScore++;
      }
    });

    return {
      realScore: rScore,
      totalReal: rTotal,
      nonsenseScore: nScore,
      totalNonsense: nTotal,
    };
  }, [currentSet, scores]);

  // Speak Current Word with Natural Phonetic Blending
  const handleSpeakCurrentWord = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speakPhoneticWord(currentWord.text, currentWord.phonetic, {
      rate: speechRate,
      voiceURI: selectedVoiceURI,
      onEnd: () => {
        setIsSpeaking(false);
      },
      onError: () => {
        setIsSpeaking(false);
      },
    });
  }, [currentWord, isSpeaking, speechRate, selectedVoiceURI]);

  // Navigate to next word or set
  const handleNextWord = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);

    if (currentWordIndex < currentSet.words.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      if (soundEffects) playChimeSound();
    } else {
      // Completed the set! Trigger gamified celebration
      setIsCelebrationOpen(true);
    }
  }, [currentWordIndex, currentSet.words.length, soundEffects]);

  // Navigate to previous word
  const handlePrevWord = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);

    if (currentWordIndex > 0) {
      setCurrentWordIndex((prev) => prev - 1);
    } else if (currentSetId > 1) {
      const prevSet = WORD_SETS.find((s) => s.id === currentSetId - 1);
      if (prevSet) {
        setCurrentSetId(prevSet.id);
        setCurrentWordIndex(prevSet.words.length - 1);
      }
    }
  }, [currentWordIndex, currentSetId]);

  // Tutor Scoring Handler
  const handleScoreWord = useCallback(
    (isCorrect: boolean) => {
      setScores((prev) => ({
        ...prev,
        [currentWord.id]: isCorrect,
      }));

      if (isCorrect) {
        setTotalStars((s) => s + 1);
        if (soundEffects) playCorrectSound();
        const randomEncouragement =
          ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
        setEncouragement(randomEncouragement);
        setTimeout(() => setEncouragement(''), 2200);
      }

      // Automatically advance to next word
      handleNextWord();
    },
    [currentWord.id, handleNextWord, soundEffects]
  );

  const handleClearScore = useCallback(() => {
    setScores((prev) => {
      const next = { ...prev };
      delete next[currentWord.id];
      return next;
    });
  }, [currentWord.id]);

  // Go to Next Set from Celebration Modal
  const handleNextSet = useCallback(() => {
    if (currentSetId < WORD_SETS.length) {
      setCurrentSetId((prev) => prev + 1);
      setCurrentWordIndex(0);
    }
  }, [currentSetId]);

  // Replay Set
  const handleReplaySet = useCallback(() => {
    setCurrentWordIndex(0);
  }, []);

  // Jump to specific set
  const handleSelectSet = useCallback((setId: number) => {
    stopSpeaking();
    setIsSpeaking(false);
    setCurrentSetId(setId);
    setCurrentWordIndex(0);
  }, []);

  // Reset all scores
  const handleResetAllScores = useCallback(() => {
    setScores({});
    setTotalStars(0);
  }, []);

  // Download Standalone Offline HTML
  const handleDownloadStandalone = useCallback(() => {
    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ufli-reading-placement-test-offline.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or modal is open
      if (
        isScriptOpen ||
        isReportOpen ||
        isSetSelectorOpen ||
        isSettingsOpen ||
        isCelebrationOpen
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleSpeakCurrentWord();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextWord();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevWord();
      } else if (isTutorMode) {
        if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          handleScoreWord(true);
        } else if (e.key.toLowerCase() === 'x') {
          e.preventDefault();
          handleScoreWord(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleSpeakCurrentWord,
    handleNextWord,
    handlePrevWord,
    handleScoreWord,
    isTutorMode,
    isScriptOpen,
    isReportOpen,
    isSetSelectorOpen,
    isSettingsOpen,
    isCelebrationOpen,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 via-sky-50/30 to-amber-50/60 font-['Lexend'] text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentSetId={currentSetId}
        totalSets={WORD_SETS.length}
        totalStars={totalStars}
        isTutorMode={isTutorMode}
        onToggleTutorMode={() => setIsTutorMode((prev) => !prev)}
        onOpenScript={() => setIsScriptOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSetSelector={() => setIsSetSelectorOpen(true)}
        onDownloadStandalone={handleDownloadStandalone}
      />

      {/* Main Flashcard Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full">
        <WordCard
          currentSet={currentSet}
          currentWord={currentWord}
          currentIndex={currentWordIndex}
          totalWords={currentSet.words.length}
          isSpeaking={isSpeaking}
          textCase={textCase}
          fontSize={fontSize}
          onSpeak={handleSpeakCurrentWord}
          onNext={handleNextWord}
          onPrev={handlePrevWord}
          canPrev={currentWordIndex > 0 || currentSetId > 1}
          canNext={true}
          encouragementText={encouragement}
        />

        {/* Tutor Scoring Panel (Appears when Tutor Mode is ON) */}
        {isTutorMode && (
          <TutorBar
            currentWord={currentWord}
            currentWordScore={scores[currentWord.id]}
            realScore={realScore}
            totalReal={totalReal}
            nonsenseScore={nonsenseScore}
            totalNonsense={totalNonsense}
            onScore={handleScoreWord}
            onClearScore={handleClearScore}
          />
        )}

        {/* Helpful Keyboard Hint Footer */}
        <footer className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-3 sm:gap-6 flex-wrap select-none">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white shadow-2xs border border-slate-200 text-slate-700 font-mono text-[10px]">
              Space
            </kbd>
            <span>Say Word</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white shadow-2xs border border-slate-200 text-slate-700 font-mono text-[10px]">
              →
            </kbd>
            <span>Next</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white shadow-2xs border border-slate-200 text-slate-700 font-mono text-[10px]">
              ←
            </kbd>
            <span>Previous</span>
          </span>
          {isTutorMode && (
            <span className="flex items-center gap-1.5 text-indigo-500 font-medium">
              <kbd className="px-1.5 py-0.5 rounded bg-white shadow-2xs border border-indigo-200 text-indigo-700 font-mono text-[10px]">
                C
              </kbd>
              <span>Correct</span>
              <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white shadow-2xs border border-rose-200 text-rose-700 font-mono text-[10px]">
                X
              </kbd>
              <span>Missed</span>
            </span>
          )}
        </footer>
      </main>

      {/* Set Selector Modal */}
      <SetSelectorModal
        isOpen={isSetSelectorOpen}
        onClose={() => setIsSetSelectorOpen(false)}
        currentSetId={currentSetId}
        onSelectSet={handleSelectSet}
        scores={scores}
      />

      {/* Administration Script Modal */}
      <ScriptModal
        isOpen={isScriptOpen}
        onClose={() => setIsScriptOpen(false)}
      />

      {/* Tutor Full Score Summary Report Modal */}
      <ScoreReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        scores={scores}
        onResetAllScores={handleResetAllScores}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        speechRate={speechRate}
        onChangeSpeechRate={setSpeechRate}
        selectedVoiceURI={selectedVoiceURI}
        onChangeVoiceURI={setSelectedVoiceURI}
        textCase={textCase}
        onChangeTextCase={setTextCase}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        soundEffects={soundEffects}
        onChangeSoundEffects={setSoundEffects}
        onDownloadStandalone={handleDownloadStandalone}
      />

      {/* Celebration Modal (on set completion) */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        setId={currentSetId}
        isFinalSet={currentSetId === WORD_SETS.length}
        onNextSet={handleNextSet}
        onReplaySet={handleReplaySet}
        scoreTally={
          isTutorMode
            ? {
                correct: realScore + nonsenseScore,
                total: totalReal + totalNonsense,
              }
            : undefined
        }
      />
    </div>
  );
}
