import React from 'react';
import { ActiveTab, UserSettings } from '../types';
import { Settings, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  openSettingsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  updateSettings,
  openSettingsModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('test')}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0">
            Type<span className="text-cyan-400">Rush</span>
          </span>
        </button>

        {/* Zone 2: Single-line Nav Links (5 links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('test')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'test'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Test
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'practice'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Practice
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'achievements'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Badges
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'tips'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tips
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Utility */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              settings.soundEnabled
                ? 'bg-slate-800/80 border-slate-700 text-cyan-400 hover:bg-slate-800'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={settings.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            aria-label="Toggle Sound"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={openSettingsModal}
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Settings"
            aria-label="Open Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-lg hover:from-cyan-300 hover:to-emerald-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
          >
            Start Typing
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div className="md:hidden flex items-center justify-around pt-3 border-t border-slate-800/60 mt-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('test')}
          className={`px-2 py-1 ${activeTab === 'test' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Test
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-2 py-1 ${activeTab === 'practice' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Practice
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-2 py-1 ${activeTab === 'leaderboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2 py-1 ${activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-2 py-1 ${activeTab === 'achievements' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Badges
        </button>
      </div>
    </header>
  );
};
