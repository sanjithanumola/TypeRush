import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  TestDuration,
  TestResult,
  UserSettings,
  Achievement
} from './types';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredResults,
  saveStoredResult,
  getStoredAchievements,
  getPersonalBests,
  clearAllUserData,
  DEFAULT_SETTINGS
} from './utils/storage';
import { Header } from './components/Header';
import { TypingEngine } from './components/TypingEngine';
import { ResultsModal } from './components/ResultsModal';
import { LeaderboardView } from './components/LeaderboardView';
import { DashboardView } from './components/DashboardView';
import { AchievementsView } from './components/AchievementsView';
import { TipsView } from './components/TipsView';
import { PracticeView } from './components/PracticeView';
import { SettingsModal } from './components/SettingsModal';
import { Zap, Timer, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings);
  const [results, setResults] = useState<TestResult[]>(getStoredResults);
  const [achievements, setAchievements] = useState<Achievement[]>(getStoredAchievements);
  const [activeTab, setActiveTab] = useState<ActiveTab>('test');

  // Modals & Active Test States
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [newlyUnlockedToast, setNewlyUnlockedToast] = useState<Achievement | null>(null);
  const [engineKey, setEngineKey] = useState<number>(1);

  // Sync settings changes
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      saveStoredSettings(merged);
      return merged;
    });
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    saveStoredSettings(DEFAULT_SETTINGS);
  };

  const handleClearAllData = () => {
    clearAllUserData();
    setResults([]);
    setAchievements(getStoredAchievements());
    setSettings(DEFAULT_SETTINGS);
  };

  // Test finished
  const handleTestComplete = (result: TestResult) => {
    const { updatedResults, isPb, newAchievements } = saveStoredResult(result);
    setResults(updatedResults);
    setLastResult({ ...result, isPersonalBest: isPb });

    // Show achievement toast if any
    if (newAchievements.length > 0) {
      setAchievements(getStoredAchievements());
      setNewlyUnlockedToast(newAchievements[0]);
      setTimeout(() => setNewlyUnlockedToast(null), 4500);
    }
  };

  const pbs = getPersonalBests(results);
  const currentBestForDuration =
    lastResult && lastResult.mode !== 'practice'
      ? pbs[String(lastResult.mode)]?.wpm || 0
      : pbs['30']?.wpm || 0;

  // Apply theme class to document body
  useEffect(() => {
    document.body.className = '';
    if (settings.theme === 'light') {
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    } else if (settings.theme === 'emerald') {
      document.body.classList.add('bg-[#02140a]', 'text-emerald-100');
    } else if (settings.theme === 'amber') {
      document.body.classList.add('bg-[#0c0a09]', 'text-amber-100');
    } else if (settings.theme === 'stealth') {
      document.body.classList.add('bg-[#0f172a]', 'text-slate-100');
    } else {
      // cyber default
      document.body.classList.add('bg-[#0b0f19]', 'text-slate-100');
    }
  }, [settings.theme]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${settings.theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0f19] text-slate-100'}`}>
      {/* Achievement Unlocked Toast */}
      {newlyUnlockedToast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-gradient-to-r from-amber-500/90 to-yellow-600/90 text-slate-950 font-sans shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="text-2xl">{newlyUnlockedToast.icon}</div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-950">
              Achievement Unlocked!
            </span>
            <span className="text-sm font-black">{newlyUnlockedToast.title}</span>
            <p className="text-xs text-amber-950/80">{newlyUnlockedToast.description}</p>
          </div>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        updateSettings={updateSettings}
        openSettingsModal={() => setShowSettingsModal(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6">
        {activeTab === 'test' && (
          <div className="space-y-10 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center pt-2 pb-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 font-mono tracking-widest uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Competitive Speed Engine
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
                How fast can you type?
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
                Race the clock. Beat your records. Become faster.
              </p>
            </div>

            {/* Quick Challenge Duration Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {[
                { dur: 15 as TestDuration, name: '15s Sprint', desc: 'Maximum burst reflexes' },
                { dur: 30 as TestDuration, name: '30s Classic', desc: 'Standard benchmark' },
                { dur: 60 as TestDuration, name: '60s Standard', desc: 'Cadence & consistency' },
                { dur: 120 as TestDuration, name: '120s Endurance', desc: 'Stamina marathon' },
              ].map((card) => {
                const pb = pbs[String(card.dur)];
                return (
                  <div
                    key={card.dur}
                    onClick={() => {
                      updateSettings({ defaultDuration: card.dur });
                      setEngineKey((k) => k + 1);
                    }}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {card.name}
                      </span>
                      <Timer className="w-3.5 h-3.5 group-hover:text-cyan-400" />
                    </div>
                    <span className="text-[10px] text-slate-500 block">{card.desc}</span>
                    <div className="mt-2 text-xs font-mono text-cyan-300 font-semibold">
                      PB: {pb?.wpm ? `${pb.wpm} WPM` : '—'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Core Typing Engine Arena */}
            <div id="typing-arena">
              <TypingEngine
                key={engineKey}
                settings={settings}
                updateSettings={updateSettings}
                onTestComplete={handleTestComplete}
                bestWpmForMode={currentBestForDuration}
              />
            </div>

            {/* Personal Records & Sample Benchmark Strip */}
            <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Personal Bests Summary</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    Your highest Net WPM recorded in this browser across challenge modes
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  View Local Leaderboard &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/60">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">15s Sprint</span>
                  <span className="text-xl font-extrabold text-white font-mono tabular-nums">
                    {pbs['15']?.wpm > 0 ? `${pbs['15'].wpm} WPM` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">30s Classic</span>
                  <span className="text-xl font-extrabold text-white font-mono tabular-nums">
                    {pbs['30']?.wpm > 0 ? `${pbs['30'].wpm} WPM` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">60s Standard</span>
                  <span className="text-xl font-extrabold text-white font-mono tabular-nums">
                    {pbs['60']?.wpm > 0 ? `${pbs['60'].wpm} WPM` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">120s Endurance</span>
                  <span className="text-xl font-extrabold text-white font-mono tabular-nums">
                    {pbs['120']?.wpm > 0 ? `${pbs['120'].wpm} WPM` : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* How It Works & Speed Tiers Section */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <span className="font-bold text-slate-200 block mb-1">Standardized WPM Formula</span>
                <p className="leading-relaxed">
                  Gross WPM calculates <code>(All keystrokes / 5) / minutes</code>. Net WPM subtracts uncorrected errors so precision is rewarded and reckless typing is penalized.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <span className="font-bold text-slate-200 block mb-1">Benchmark Velocity Tiers</span>
                <p className="leading-relaxed">
                  Average adult: 40 WPM · Professional typist: 65–75 WPM · Competitive esports: 90–110 WPM · World class: 120+ WPM.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <PracticeView settings={settings} updateSettings={updateSettings} />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            results={results}
            onClearLeaderboard={handleClearAllData}
            currentNickname={settings.nickname}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            results={results}
            settings={settings}
            onClearAll={handleClearAllData}
            onRefreshData={() => {
              setResults(getStoredResults());
              setAchievements(getStoredAchievements());
            }}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView achievements={achievements} />
        )}

        {activeTab === 'tips' && <TipsView />}
      </main>

      {/* Results Modal */}
      {lastResult && (
        <ResultsModal
          result={lastResult}
          previousBestWpm={currentBestForDuration}
          onRetry={() => {
            setLastResult(null);
            setEngineKey((k) => k + 1);
          }}
          onNewChallenge={() => {
            setLastResult(null);
            setEngineKey((k) => k + 1);
          }}
          onClose={() => setLastResult(null)}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          updateSettings={updateSettings}
          onResetSettings={handleResetSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Quiet Footer */}
      <footer className="w-full border-t border-slate-800/60 py-6 px-4 sm:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">TypeRush</span>
            <span>·</span>
            <span>Local Browser Typing Challenge</span>
            <span>·</span>
            <span>Zero external dependencies</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('tips')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Typing Guide
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Settings
            </button>
            <button
              onClick={() => {
                setActiveTab('test');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Back to Top &uarr;
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
