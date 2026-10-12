import React from 'react';
import { BookOpen, Check, Keyboard, ShieldAlert, Sparkles, Cpu } from 'lucide-react';

export const TipsView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-cyan-400" />
          <span>Typing Mastery & Calculations Guide</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Learn how professional typists sustain 100+ WPM with effortless ergonomics and zero strain
        </p>
      </div>

      {/* Formula Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Cpu className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Gross WPM vs Net WPM</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            In competitive typing and stenography, a standardized &quot;word&quot; is mathematically defined as exactly <strong>5 keystrokes</strong> (including spaces and punctuation).
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">GROSS WORDS PER MINUTE</span>
              <code className="text-cyan-300">Gross WPM = (Total Characters Typed / 5) / Minutes</code>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">NET WORDS PER MINUTE (Adjusted for Errors)</span>
              <code className="text-emerald-300">Net WPM = ((Correct Chars / 5) - Errors) / Minutes</code>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Accuracy Calculation</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Accuracy represents your precision quotient. High gross speed with low accuracy leads to frequent stopping, cognitive resets, and severe net speed penalties.
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
            <span className="text-slate-500 block text-[10px]">ACCURACY FORMULA</span>
            <code className="text-emerald-300">Accuracy % = (Correct Characters / Total Attempted) × 100</code>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">
              Rule of thumb: Always aim for <strong>&ge; 98% accuracy</strong> before trying to push your physical raw speed.
            </p>
          </div>
        </div>
      </div>

      {/* Home Row & Finger Placement Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-cyan-400" />
          <span>Touch Typing Home Row Placement</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Your fingers should rest lightly on the home row keys. Both <code className="text-cyan-300 font-mono bg-slate-800 px-1 py-0.5 rounded">F</code> and <code className="text-cyan-300 font-mono bg-slate-800 px-1 py-0.5 rounded">J</code> keys have physical tactile bumps to help you calibrate without looking down.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-cyan-400 font-mono uppercase block mb-2">Left Hand Position</span>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li>• Pinky finger: <strong className="text-white">A</strong> (also `, 1, Tab, Caps, Shift)</li>
              <li>• Ring finger: <strong className="text-white">S</strong> (also 2, W, X)</li>
              <li>• Middle finger: <strong className="text-white">D</strong> (also 3, E, C)</li>
              <li>• Index finger: <strong className="text-white">F</strong> (also 4, 5, R, T, G, V, B)</li>
              <li>• Left Thumb: Left half of Spacebar</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-emerald-400 font-mono uppercase block mb-2">Right Hand Position</span>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li>• Index finger: <strong className="text-white">J</strong> (also 6, 7, Y, U, H, N, M)</li>
              <li>• Middle finger: <strong className="text-white">K</strong> (also 8, I, comma ,)</li>
              <li>• Ring finger: <strong className="text-white">L</strong> (also 9, O, period .)</li>
              <li>• Pinky finger: <strong className="text-white">;</strong> (also 0, P, slash /, Enter, Shift)</li>
              <li>• Right Thumb: Right half of Spacebar</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ergonomic & Speed Habits */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">Five Pillars of Top-Tier Typing Velocity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Float Your Wrists</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Do not rest your palms or wrists heavily on the table while typing. Keep wrists straight and suspended to avoid carpal strain.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Read 2 to 3 Words Ahead</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Elite typists do not read character-by-character. Look 2–3 words forward so your fingers buffer word patterns seamlessly.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Maintain Constant Cadence</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                A smooth, steady metronome rhythm types faster than sprinting and stopping on mistakes. Consistency creates velocity.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Never Look at the Keyboard</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Trust your muscle memory. Looking at keys breaks your optical tracking and adds a 200–300ms visual penalty on every glance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
