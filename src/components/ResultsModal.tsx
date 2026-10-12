import React, { useState } from 'react';
import { TestResult } from '../types';
import { WpmTimelineChart } from './WpmChart';
import { RotateCcw, ArrowRight, Share2, Check, Trophy, Sparkles } from 'lucide-react';

interface ResultsModalProps {
  result: TestResult;
  previousBestWpm: number;
  onRetry: () => void;
  onNewChallenge: () => void;
  onClose: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  previousBestWpm,
  onRetry,
  onNewChallenge,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const isPb = result.netWpm > previousBestWpm;
  const pbDiff = previousBestWpm > 0 ? result.netWpm - previousBestWpm : result.netWpm;

  // Determine tier & performance assessment message
  let tierTitle = 'Beginner Typist';
  let tierColor = 'text-slate-400';
  let message = 'Keep building consistency! Focus on rhythm and home row accuracy.';

  if (result.netWpm >= 120) {
    tierTitle = 'Transcendent / Godspeed';
    tierColor = 'text-amber-400';
    message = 'Mythic reflexes! You are typing faster than 99.8% of humans on Earth.';
  } else if (result.netWpm >= 100) {
    tierTitle = 'Master Typist';
    tierColor = 'text-purple-400';
    message = 'Incredible velocity! Triple-digit WPM puts you in the top competitive tier.';
  } else if (result.netWpm >= 80) {
    tierTitle = 'Lightning Typist';
    tierColor = 'text-cyan-400';
    message = 'Exceptional speed and precision! You blaze through prose effortlessly.';
  } else if (result.netWpm >= 60) {
    tierTitle = 'Advanced Typist';
    tierColor = 'text-emerald-400';
    message = 'Great pace! You comfortably exceed the standard professional typing speed.';
  } else if (result.netWpm >= 40) {
    tierTitle = 'Fluent Typist';
    tierColor = 'text-blue-400';
    message = 'Solid work! Push your finger muscle memory to cross the 60 WPM barrier.';
  }

  const handleCopyCard = () => {
    const text = [
      `⚡ TypeRush Challenge Completed!`,
      `Speed: ${result.netWpm} Net WPM (Gross: ${result.grossWpm} WPM)`,
      `Accuracy: ${result.accuracy}% (${result.correctChars} correct / ${result.incorrectChars} errors)`,
      `Mode: ${result.mode === 'practice' ? 'Practice' : `${result.mode}s Test`}`,
      result.isPersonalBest ? `🏆 NEW PERSONAL RECORD (+${pbDiff} WPM)` : ``,
      `https://ais-dev-5xnm4g2shpmht5jly2lb2o-521982625481.asia-east1.run.app`
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 relative">
        {/* PB Celebration Banner */}
        {isPb && (
          <div className="mb-6 p-3 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-sm font-bold text-amber-300">New Personal Record!</span>
                <span className="text-xs text-amber-200/80 ml-2">
                  {previousBestWpm > 0 ? `+${pbDiff} WPM faster than your previous best` : 'First record logged!'}
                </span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        )}

        {/* Header & Main Score */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">Test Complete</span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-6xl sm:text-7xl font-extrabold text-white tracking-tight font-mono tabular-nums">
                {result.netWpm}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-cyan-400 tracking-wide font-mono">NET WPM</span>
                <span className="text-xs text-slate-400 font-mono">Gross: {result.grossWpm} WPM</span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-baseline sm:items-end gap-2 text-left sm:text-right">
            <span className={`text-base font-bold ${tierColor}`}>{tierTitle}</span>
            <span className="text-xs text-slate-400">{message}</span>
          </div>
        </div>

        {/* Primary Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Accuracy</span>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5">
              {result.accuracy}%
            </div>
            <span className="text-[10px] text-slate-500">Target: 98%+</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Characters</span>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5">
              <span className="text-emerald-400">{result.correctChars}</span>
              <span className="text-slate-500 text-lg">/</span>
              <span className="text-rose-400">{result.incorrectChars}</span>
            </div>
            <span className="text-[10px] text-slate-500">Correct / Errors</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Duration</span>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5">
              {result.duration}s
            </div>
            <span className="text-[10px] text-slate-500">Mode: {result.mode === 'practice' ? 'Practice' : `${result.mode}s`}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Previous PB</span>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5">
              {previousBestWpm > 0 ? `${previousBestWpm} WPM` : 'None'}
            </div>
            <span className="text-[10px] text-slate-500">
              {isPb ? 'Surpassed!' : `${Math.abs(result.netWpm - previousBestWpm)} WPM away`}
            </span>
          </div>
        </div>

        {/* Speed Timeline Visualization */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">
              Speed Curve Over Time
            </span>
            <span className="text-xs text-slate-500 font-mono">WPM per second</span>
          </div>
          <WpmTimelineChart timeline={result.wpmTimeline} averageWpm={result.netWpm} />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCard}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Score!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Score Card</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewChallenge}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>New Passage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onRetry}
              autoFocus
              className="px-5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:from-cyan-300 hover:to-emerald-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Test (Tab)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
