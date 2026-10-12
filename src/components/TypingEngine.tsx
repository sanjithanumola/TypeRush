import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Difficulty,
  PracticeCategory,
  TestDuration,
  TestResult,
  UserSettings,
  WpmPoint
} from '../types';
import { generateTypingPassage, getDailyChallengeDateStr } from '../utils/textGenerator';
import { sound } from '../utils/sound';
import { VirtualKeyboard } from './VirtualKeyboard';
import { RotateCcw, Volume2, VolumeX, Keyboard, Flame, Sparkles } from 'lucide-react';

interface TypingEngineProps {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  onTestComplete: (result: TestResult) => void;
  bestWpmForMode: number;
}

export const TypingEngine: React.FC<TypingEngineProps> = ({
  settings,
  updateSettings,
  onTestComplete,
  bestWpmForMode,
}) => {
  // Test configuration
  const [duration, setDuration] = useState<TestDuration>(settings.defaultDuration);
  const [category, setCategory] = useState<PracticeCategory>(settings.defaultCategory);
  const [difficulty, setDifficulty] = useState<Difficulty>(settings.defaultDifficulty);

  // Engine state
  const [passage, setPassage] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(typeof duration === 'number' ? duration : 0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Live metrics
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [wpmTimeline, setWpmTimeline] = useState<WpmPoint[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // DOM references
  const inputRef = useRef<HTMLInputElement>(null);
  const passageContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Initialize passage
  const loadNewPassage = useCallback(
    (cat = category, diff = difficulty) => {
      const newText = generateTypingPassage(cat, diff, 120);
      setPassage(newText);
      setUserInput('');
      setIsActive(false);
      setIsFinished(false);
      setElapsedSeconds(0);
      setTimeLeft(typeof duration === 'number' ? duration : 0);
      setStreak(0);
      setMaxStreak(0);
      setWpmTimeline([]);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    },
    [category, difficulty, duration]
  );

  // Initial load
  useEffect(() => {
    loadNewPassage();
  }, [loadNewPassage]);

  // Duration changes
  const handleDurationChange = (newDur: TestDuration) => {
    setDuration(newDur);
    setUserInput('');
    setIsActive(false);
    setIsFinished(false);
    setElapsedSeconds(0);
    setTimeLeft(typeof newDur === 'number' ? newDur : 0);
    setStreak(0);
    setWpmTimeline([]);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCategoryChange = (newCat: PracticeCategory) => {
    setCategory(newCat);
    loadNewPassage(newCat, difficulty);
  };

  const handleDifficultyChange = (newDiff: Difficulty) => {
    setDifficulty(newDiff);
    loadNewPassage(category, newDiff);
  };

  // Scroll active character into comfortable view
  useEffect(() => {
    if (activeCharRef.current && passageContainerRef.current) {
      const container = passageContainerRef.current;
      const char = activeCharRef.current;
      const charTop = char.offsetTop;
      const containerTop = container.scrollTop;

      // Keep current line near vertical center
      if (charTop - containerTop > 100 || charTop - containerTop < 20) {
        container.scrollTo({
          top: Math.max(0, charTop - 60),
          behavior: settings.reducedMotion ? 'auto' : 'smooth',
        });
      }
    }
  }, [userInput, settings.reducedMotion]);

  // Calculate live stats
  const calculateStats = useCallback(() => {
    const totalAttempted = userInput.length;
    let correct = 0;
    let uncorrected = 0;

    for (let i = 0; i < totalAttempted; i++) {
      if (userInput[i] === passage[i]) {
        correct++;
      } else {
        uncorrected++;
      }
    }

    const currentSeconds = duration === 'practice' ? Math.max(1, elapsedSeconds) : Math.max(1, (duration as number) - timeLeft);
    const elapsedMinutes = currentSeconds / 60;

    // Standard Gross WPM: 5 typed characters per word
    const grossWpm = elapsedMinutes > 0 ? Math.round((totalAttempted / 5) / elapsedMinutes) : 0;
    // Net WPM: Correct words minus errors
    const netWpm = elapsedMinutes > 0 ? Math.max(0, Math.round(((correct / 5) - uncorrected) / elapsedMinutes)) : 0;
    const accuracy = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 1000) / 10 : 100;

    return {
      grossWpm,
      netWpm,
      accuracy,
      correctChars: correct,
      incorrectChars: uncorrected,
      totalChars: totalAttempted,
      uncorrectedErrors: uncorrected,
    };
  }, [userInput, passage, duration, elapsedSeconds, timeLeft]);

  // End test handler
  const finishTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsActive(false);
    setIsFinished(true);

    const stats = calculateStats();
    const finalSeconds = duration === 'practice' ? elapsedSeconds : (duration as number);

    const testResult: TestResult = {
      id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      duration: Math.max(1, finalSeconds),
      mode: duration,
      category,
      difficulty,
      grossWpm: stats.grossWpm,
      netWpm: stats.netWpm,
      accuracy: stats.accuracy,
      correctChars: stats.correctChars,
      incorrectChars: stats.incorrectChars,
      totalChars: stats.totalChars,
      uncorrectedErrors: stats.uncorrectedErrors,
      nickname: settings.nickname || 'Speedster',
      wpmTimeline,
    };

    if (settings.soundEnabled) {
      if (stats.netWpm > bestWpmForMode && bestWpmForMode > 0) {
        sound.playRecordFanfare(settings.soundVolume);
      } else {
        sound.playSuccess(settings.soundVolume);
      }
    }

    onTestComplete(testResult);
  }, [
    calculateStats,
    duration,
    elapsedSeconds,
    category,
    difficulty,
    settings.nickname,
    settings.soundEnabled,
    settings.soundVolume,
    wpmTimeline,
    bestWpmForMode,
    onTestComplete,
  ]);

  // Timer loop
  useEffect(() => {
    if (!isActive) return;

    timerIntervalRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        const nextSec = prev + 1;

        // Collect second-by-second timeline point
        const stats = calculateStats();
        setWpmTimeline((pts) => [
          ...pts,
          { second: nextSec, wpm: stats.netWpm, accuracy: stats.accuracy },
        ]);

        return nextSec;
      });

      if (typeof duration === 'number') {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isActive, duration, calculateStats, finishTest]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const value = e.target.value;

    // Strict Mode: prevent backspace shortening if strict mode enabled
    if (settings.strictMode && value.length < userInput.length) {
      return;
    }

    // Start timer on first keystroke
    if (!isActive && value.length > 0) {
      setIsActive(true);
    }

    const lastCharIdx = value.length - 1;
    if (lastCharIdx >= 0) {
      const typedChar = value[lastCharIdx];
      const targetChar = passage[lastCharIdx];
      const isCorrect = typedChar === targetChar;

      setActiveKey(typedChar);
      setTimeout(() => setActiveKey(null), 120);

      if (settings.soundEnabled) {
        if (isCorrect) {
          sound.playKey(settings.soundType, settings.soundVolume);
        } else {
          sound.playError(settings.soundVolume);
        }
      }

      // Track streak
      if (isCorrect) {
        setStreak((s) => {
          const next = s + 1;
          if (next > maxStreak) setMaxStreak(next);
          // Play celebratory streak sound every 50 characters
          if (next % 50 === 0 && settings.soundEnabled) {
            sound.playStreak(settings.soundVolume);
          }
          return next;
        });
      } else {
        setStreak(0);
      }
    }

    setUserInput(value);

    // If passage is fully typed
    if (value.length >= passage.length && passage.length > 0) {
      finishTest();
    }
  };

  // Keyboard shortcut: Tab to restart immediately, Escape to blur/reset
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      loadNewPassage();
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  // Prevent pasting entire passages
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const currentStats = calculateStats();
  const nextTargetChar = passage[userInput.length] || null;

  // Font size classes
  let fontSizeClass = 'text-2xl sm:text-3xl leading-relaxed';
  if (settings.fontSize === 'compact') fontSizeClass = 'text-xl sm:text-2xl leading-relaxed';
  if (settings.fontSize === 'large') fontSizeClass = 'text-3xl sm:text-4xl leading-loose';
  if (settings.fontSize === 'xlarge') fontSizeClass = 'text-4xl sm:text-5xl leading-loose';

  // Time progress percentage
  const progressPercent =
    typeof duration === 'number'
      ? Math.max(0, Math.min(100, ((duration - timeLeft) / duration) * 100))
      : 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Challenge Controls & Filter Bar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-6 p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
        {/* Durations */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl">
          {([15, 30, 60, 120, 'practice'] as TestDuration[]).map((d) => (
            <button
              key={d}
              onClick={() => handleDurationChange(d)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                duration === d
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d === 'practice' ? 'Practice' : `${d}s`}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl overflow-x-auto">
          {[
            { id: 'common', label: 'Words' },
            { id: 'sentences', label: 'Quotes' },
            { id: 'punctuation', label: 'Punctuation' },
            { id: 'code', label: 'Code' },
            { id: 'beginner', label: 'Beginner' },
            { id: 'daily', label: 'Daily Challenge' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id as PracticeCategory)}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                category === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        {category === 'common' && (
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  difficulty === diff
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Real-time HUD Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 mb-4 px-2">
        <div className="flex items-center gap-6">
          {/* Timer Display */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tabular-nums">
              {typeof duration === 'number' ? timeLeft : elapsedSeconds}
            </span>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
              {typeof duration === 'number' ? 's remaining' : 's elapsed'}
            </span>
          </div>

          {/* Live WPM & Accuracy */}
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 border-l border-slate-800 pl-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">WPM</span>
              <span className="text-lg font-bold text-white tabular-nums">
                {currentStats.netWpm}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Accuracy</span>
              <span className="text-lg font-bold text-white tabular-nums">
                {currentStats.accuracy}%
              </span>
            </div>
            {streak > 5 && (
              <div className="hidden sm:flex items-center gap-1 text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400/20" />
                <span className="font-bold tabular-nums">{streak}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Utilities */}
        <div className="flex items-center gap-2">
          {category === 'daily' && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getDailyChallengeDateStr()}</span>
            </div>
          )}

          <button
            onClick={() => updateSettings({ showKeyboard: !settings.showKeyboard })}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              settings.showKeyboard
                ? 'bg-slate-800 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle On-Screen Keyboard"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              settings.soundEnabled
                ? 'bg-slate-800 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Sound Effects"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => loadNewPassage()}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Restart Test (Tab)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar (for timed modes) */}
      {typeof duration === 'number' && (
        <div className="w-full max-w-4xl h-1 bg-slate-800 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Main Interactive Typing Canvas */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="w-full max-w-4xl relative p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl cursor-text transition-all focus-within:border-cyan-500/50 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
      >
        {/* Hidden Input field capturing real keystrokes & virtual mobile keyboards */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-auto cursor-text z-10"
        />

        {/* Rendered Text Passage */}
        <div
          ref={passageContainerRef}
          className={`font-mono ${fontSizeClass} select-none h-44 sm:h-52 overflow-hidden transition-all`}
        >
          {passage.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const isCorrect = isTyped && userInput[index] === char;
            const isIncorrect = isTyped && userInput[index] !== char;

            let charColor = 'text-slate-600'; // upcoming neutral
            if (isCorrect) charColor = 'text-cyan-400';
            if (isIncorrect) charColor = 'text-rose-400 bg-rose-500/20 rounded px-0.5';

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharRef : null}
                className={`relative inline-block transition-colors duration-75 ${charColor}`}
              >
                {/* Active character cursor */}
                {isCurrent && (
                  <span className="absolute -left-[1px] top-1 bottom-1 w-[2.5px] bg-cyan-400 rounded-full typing-cursor shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>

        {/* Quiet instructional reminder */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-500 font-mono">
          <span>Click anywhere or start typing to begin</span>
          <span className="hidden sm:inline">Press [Tab] to restart · [Esc] to unfocus</span>
        </div>
      </div>

      {/* On-screen virtual keyboard toggle */}
      {settings.showKeyboard && (
        <div className="w-full max-w-4xl mt-6">
          <VirtualKeyboard activeKey={activeKey} nextChar={nextTargetChar} />
        </div>
      )}
    </div>
  );
};
