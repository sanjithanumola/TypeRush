import React from 'react';
import {
  Difficulty,
  FontSizeChoice,
  TestDuration,
  ThemeName,
  UserSettings,
} from '../types';
import { X, Sliders, Volume2, Shield, Eye, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetSettings: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  updateSettings,
  onResetSettings,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">Preferences & Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Player Nickname */}
          <div>
            <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider block mb-2">
              Leaderboard Nickname
            </label>
            <input
              type="text"
              value={settings.nickname}
              maxLength={20}
              onChange={(e) => updateSettings({ nickname: e.target.value.trim() || 'Speedster' })}
              placeholder="e.g. Speedster"
              className="w-full text-xs font-mono bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Displayed on your local browser records</span>
          </div>

          {/* Theme Palette */}
          <div>
            <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider block mb-2">
              Theme Palette
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'cyber', label: 'Cyber Neon', color: 'bg-cyan-500' },
                { id: 'stealth', label: 'Stealth Slate', color: 'bg-slate-400' },
                { id: 'emerald', label: 'Matrix Emerald', color: 'bg-emerald-500' },
                { id: 'amber', label: 'Obsidian Gold', color: 'bg-amber-500' },
                { id: 'light', label: 'Clean Light', color: 'bg-white' },
              ].map((thm) => (
                <button
                  key={thm.id}
                  onClick={() => updateSettings({ theme: thm.id as ThemeName })}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    settings.theme === thm.id
                      ? 'bg-slate-800 border-cyan-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${thm.color}`} />
                  <span>{thm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typing Font Size */}
          <div>
            <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider block mb-2">
              Typing Area Font Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['compact', 'normal', 'large', 'xlarge'] as FontSizeChoice[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateSettings({ fontSize: sz })}
                  className={`py-2 px-3 rounded-xl border text-xs capitalize font-medium transition-all cursor-pointer ${
                    settings.fontSize === sz
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Audio FX */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Audio Feedback</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {settings.soundEnabled && (
              <>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[
                    { id: 'click', label: 'Mechanical' },
                    { id: 'typewriter', label: 'Typewriter' },
                    { id: 'blip', label: 'Soft Tone' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateSettings({ soundType: s.id as 'click' | 'typewriter' | 'blip' })}
                      className={`py-1.5 px-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        settings.soundType === s.id
                          ? 'bg-slate-800 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Volume</span>
                    <span>{Math.round(settings.soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={settings.soundVolume}
                    onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>

          {/* Strict Mode (No Backspace) */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Strict Mode (No Backspace)</span>
                <span className="text-[11px] text-slate-400">
                  Disables deleting errors. Forces absolute rhythm and unforgiving accuracy.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.strictMode}
              onChange={(e) => updateSettings({ strictMode: e.target.checked })}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-start gap-3">
              <Eye className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Reduced Motion</span>
                <span className="text-[11px] text-slate-400">
                  Minimizes transitions and smooth scrolling for sensitivity.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Reset Settings Action */}
          <div className="pt-2 flex justify-between items-center border-t border-slate-800">
            <button
              onClick={onResetSettings}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
