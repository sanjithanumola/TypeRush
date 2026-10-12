import React, { useState } from 'react';
import { UserSettings } from '../types';
import { sound } from '../utils/sound';
import { VirtualKeyboard } from './VirtualKeyboard';
import { Target, RotateCcw, Volume2, VolumeX, Keyboard } from 'lucide-react';

interface PracticeViewProps {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const DRILL_PRESETS = [
  {
    id: 'homerow',
    name: 'Home Row Drills',
    desc: 'Master the core keys: A S D F J K L ;',
    text: 'asdf jkl; asdf jkl; fad lad ask flash fall glad salad flask half salsa dash flask hall dash sad fad flask',
  },
  {
    id: 'toprow',
    name: 'Top Row Drills',
    desc: 'Reach up to Q W E R T Y U I O P',
    text: 'quiet power write tree route quote report Europe write pepper require poetry prepare pure require outer write',
  },
  {
    id: 'bottomrow',
    name: 'Bottom Row Drills',
    desc: 'Reach down to Z X C V B N M , . /',
    text: 'zone cave zinc calm scan bomb mask verb comb zero buzz move next maze check back numb menu blank',
  },
  {
    id: 'numbers',
    name: 'Number Row & Symbols',
    desc: '1 2 3 4 5 6 7 8 9 0 and symbols ! @ # $ %',
    text: 'item #42 costs $19.99 (save 25%); order ID 83921-X, balance: 100% verified on 2026-10-12 at 09:45 AM.',
  },
  {
    id: 'tricky',
    name: 'Frequent Tricky Words',
    desc: 'Words with double letters and irregular rhythm',
    text: 'rhythm parallel accommodate embarrass bureaucracy occurrence guarantee medieval liaison millennium vacuum dilemma',
  },
];

export const PracticeView: React.FC<PracticeViewProps> = ({
  settings,
  updateSettings,
}) => {
  const [selectedPreset, setSelectedPreset] = useState(DRILL_PRESETS[0].id);
  const [customText, setCustomText] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [activeDrillText, setActiveDrillText] = useState(DRILL_PRESETS[0].text);

  const [userInput, setUserInput] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSecs, setElapsedSecs] = useState(0);

  const handleSelectPreset = (preset: typeof DRILL_PRESETS[0]) => {
    setSelectedPreset(preset.id);
    setIsCustom(false);
    setActiveDrillText(preset.text);
    setUserInput('');
    setStartTime(null);
    setElapsedSecs(0);
  };

  const handleApplyCustom = () => {
    if (customText.trim().length > 5) {
      setIsCustom(true);
      setActiveDrillText(customText.trim());
      setUserInput('');
      setStartTime(null);
      setElapsedSecs(0);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setStartTime(null);
    setElapsedSecs(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (settings.strictMode && val.length < userInput.length) {
      return;
    }

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    const lastCharIdx = val.length - 1;
    if (lastCharIdx >= 0) {
      const typed = val[lastCharIdx];
      const target = activeDrillText[lastCharIdx];
      const isCorrect = typed === target;

      setActiveKey(typed);
      setTimeout(() => setActiveKey(null), 120);

      if (settings.soundEnabled) {
        if (isCorrect) {
          sound.playKey(settings.soundType, settings.soundVolume);
        } else {
          sound.playError(settings.soundVolume);
        }
      }
    }

    setUserInput(val);
  };

  // Compute stats
  let correct = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === activeDrillText[i]) correct++;
  }
  const accuracy = userInput.length > 0 ? Math.round((correct / userInput.length) * 100) : 100;
  const currentElapsed = startTime ? Math.max(1, Math.round((Date.now() - startTime) / 1000)) : 1;
  const wpm = startTime && currentElapsed > 0 ? Math.round((userInput.length / 5) / (currentElapsed / 60)) : 0;

  const nextChar = activeDrillText[userInput.length] || null;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 animate-fade-in space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Target className="w-7 h-7 text-cyan-400" />
            <span>Targeted Practice Lab</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Focus on specific rows, tricky muscle-memory patterns, or paste your own custom practice prose
          </p>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateSettings({ showKeyboard: !settings.showKeyboard })}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              settings.showKeyboard ? 'bg-slate-800 border-cyan-500/50 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="Toggle On-Screen Keyboard"
          >
            <Keyboard className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              settings.soundEnabled ? 'bg-slate-800 border-cyan-500/50 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="Toggle Sound"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Restart Drill"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Drills Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {DRILL_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              !isCustom && selectedPreset === p.id
                ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <span className={`text-xs font-bold block ${!isCustom && selectedPreset === p.id ? 'text-cyan-300' : 'text-slate-200'}`}>
              {p.name}
            </span>
            <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{p.desc}</span>
          </button>
        ))}
      </div>

      {/* Custom Text Accordion */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Or paste any custom text to practice..."
          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <button
          onClick={handleApplyCustom}
          disabled={customText.trim().length < 5}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 disabled:opacity-40 border border-slate-700 whitespace-nowrap cursor-pointer"
        >
          Use Custom Text
        </button>
      </div>

      {/* Live HUD */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">WPM</span>
            <span className="text-xl font-bold text-white tabular-nums">{wpm}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Accuracy</span>
            <span className="text-xl font-bold text-emerald-400 tabular-nums">{accuracy}%</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Progress</span>
            <span className="text-xl font-bold text-cyan-400 tabular-nums">
              {userInput.length}/{activeDrillText.length}
            </span>
          </div>
        </div>
        <span className="text-slate-500">Untimed practice mode</span>
      </div>

      {/* Practice Typing Canvas */}
      <div
        className="w-full relative p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl cursor-text focus-within:border-cyan-500/50"
      >
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-auto cursor-text z-10"
        />

        <div className="font-mono text-xl sm:text-2xl leading-relaxed select-none min-h-[120px]">
          {activeDrillText.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const isCorrect = isTyped && userInput[index] === char;
            const isIncorrect = isTyped && userInput[index] !== char;

            let charColor = 'text-slate-600';
            if (isCorrect) charColor = 'text-cyan-400';
            if (isIncorrect) charColor = 'text-rose-400 bg-rose-500/20 rounded px-0.5';

            return (
              <span key={index} className={`relative inline-block ${charColor}`}>
                {isCurrent && (
                  <span className="absolute -left-[1px] top-1 bottom-1 w-[2.5px] bg-cyan-400 rounded-full typing-cursor" />
                )}
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>
      </div>

      {/* On-screen virtual keyboard */}
      {settings.showKeyboard && (
        <div className="w-full mt-4">
          <VirtualKeyboard activeKey={activeKey} nextChar={nextChar} />
        </div>
      )}
    </div>
  );
};
