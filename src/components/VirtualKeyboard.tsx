import React from 'react';

interface VirtualKeyboardProps {
  activeKey: string | null;
  nextChar: string | null;
}

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space']
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, nextChar }) => {
  const normalizedActive = activeKey ? activeKey.toLowerCase() : null;
  const normalizedNext = nextChar ? nextChar.toLowerCase() : null;

  const isKeyActive = (key: string) => {
    if (!normalizedActive) return false;
    if (key === 'Space' && normalizedActive === ' ') return true;
    if (key === 'Backspace' && normalizedActive === 'backspace') return true;
    if (key === 'Enter' && normalizedActive === 'enter') return true;
    if (key === 'Tab' && normalizedActive === 'tab') return true;
    return key.toLowerCase() === normalizedActive;
  };

  const isKeyNext = (key: string) => {
    if (!normalizedNext) return false;
    if (key === 'Space' && normalizedNext === ' ') return true;
    return key.toLowerCase() === normalizedNext;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md select-none">
      <div className="flex flex-col gap-1.5 items-center">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1.5 w-full justify-center">
            {row.map((k, kIdx) => {
              const active = isKeyActive(k);
              const next = isKeyNext(k);

              let widthClass = 'w-9 sm:w-11';
              if (k === 'Backspace') widthClass = 'w-16 sm:w-20 text-[11px]';
              if (k === 'Tab') widthClass = 'w-12 sm:w-14 text-[11px]';
              if (k === 'Caps') widthClass = 'w-14 sm:w-16 text-[11px]';
              if (k === 'Enter') widthClass = 'w-16 sm:w-20 text-[11px]';
              if (k === 'Shift') widthClass = 'w-16 sm:w-20 text-[11px]';
              if (k === 'Space') widthClass = 'w-56 sm:w-80';

              let keyStyle = 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-slate-600';
              if (active) {
                keyStyle = 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)] scale-95 transition-transform duration-75';
              } else if (next) {
                keyStyle = 'bg-cyan-950/60 text-cyan-300 border-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.3)] animate-pulse';
              }

              return (
                <div
                  key={`${rIdx}-${kIdx}`}
                  className={`h-9 sm:h-10 flex items-center justify-center rounded-lg border font-mono text-xs font-medium transition-all duration-150 ${widthClass} ${keyStyle}`}
                >
                  {k === 'Space' ? '—' : k}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
