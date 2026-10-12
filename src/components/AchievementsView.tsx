import React from 'react';
import { Achievement } from '../types';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlockedAt !== null).length;
  const totalCount = achievements.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-400" />
            <span>Achievements & Badges</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Unlock trophies by setting speed records, mastering accuracy, and maintaining streaks
          </p>
        </div>

        {/* Unlock summary */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">Progress</span>
            <span className="text-base font-bold text-white font-mono tabular-nums">
              {unlockedCount} / {totalCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 flex items-center justify-center font-bold text-xs text-cyan-400 font-mono">
            {percentage}%
          </div>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {achievements.map((ach) => {
          const isUnlocked = ach.unlockedAt !== null;

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/20 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${
                    isUnlocked
                      ? 'bg-cyan-500/20 border border-cyan-500/40 shadow-inner'
                      : 'bg-slate-800 text-slate-600 border border-slate-700/60'
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-600" />}
                </div>

                {isUnlocked ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-600">Locked</span>
                )}
              </div>

              <h4 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                {ach.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ach.description}</p>

              {isUnlocked && ach.unlockedAt && (
                <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                  Earned {new Date(ach.unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
