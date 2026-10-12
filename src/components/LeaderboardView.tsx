import React, { useState } from 'react';
import { TestDuration, TestResult } from '../types';
import { Trophy, Medal, Trash2, ArrowUpDown, Flame, User } from 'lucide-react';

interface LeaderboardViewProps {
  results: TestResult[];
  onClearLeaderboard: () => void;
  currentNickname: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  results,
  onClearLeaderboard,
  currentNickname,
}) => {
  const [filterMode, setFilterMode] = useState<TestDuration>(30);
  const [sortBy, setSortBy] = useState<'wpm' | 'accuracy' | 'date'>('wpm');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter for chosen mode
  const filtered = results.filter((r) => r.mode === filterMode);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'wpm') return b.netWpm - a.netWpm;
    if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
    return b.timestamp - a.timestamp;
  });

  // Top 3 Podium
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  return (
    <div className="w-full max-w-4xl mx-auto py-6 animate-fade-in">
      {/* Title & Honest Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-400" />
            <span>Local Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browser records ranked by speed and accuracy · No cloud sync or fake competitors
          </p>
        </div>

        {results.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Records</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Clear Leaderboard Records?</h3>
            <p className="text-sm text-slate-400 mb-6">
              This will permanently delete all locally saved records and test history from your browser.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearLeaderboard();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6">
        {/* Mode Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl">
          {([15, 30, 60, 120, 'practice'] as TestDuration[]).map((m) => (
            <button
              key={m}
              onClick={() => setFilterMode(m)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterMode === m
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m === 'practice' ? 'Practice' : `${m}s`}
            </button>
          ))}
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span>Sort:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl">
            <button
              onClick={() => setSortBy('wpm')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                sortBy === 'wpm' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Speed (WPM)
            </button>
            <button
              onClick={() => setSortBy('accuracy')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                sortBy === 'accuracy' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Accuracy
            </button>
            <button
              onClick={() => setSortBy('date')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                sortBy === 'date' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Recent
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Podium (if at least 1 record) */}
      {sorted.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {/* Rank 2 */}
          <div className="order-2 sm:order-1 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-slate-700/60 text-slate-300 font-bold flex items-center justify-center text-xs mb-2">
              🥈 2nd
            </div>
            {top2 ? (
              <>
                <span className="text-sm font-bold text-white truncate max-w-full">{top2.nickname}</span>
                <span className="text-3xl font-extrabold text-slate-200 font-mono tabular-nums my-1">
                  {top2.netWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">{top2.accuracy}% accuracy · {top2.dateStr}</span>
              </>
            ) : (
              <span className="text-xs text-slate-500 my-4">No second record yet</span>
            )}
          </div>

          {/* Rank 1 */}
          <div className="order-1 sm:order-2 p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-slate-900/80 border border-amber-500/40 flex flex-col items-center text-center shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-sm mb-2 border border-amber-500/40">
              🥇 1st
            </div>
            {top1 ? (
              <>
                <span className="text-base font-bold text-amber-200 truncate max-w-full">{top1.nickname}</span>
                <span className="text-4xl font-extrabold text-amber-300 font-mono tabular-nums my-1">
                  {top1.netWpm} <span className="text-xs font-normal text-amber-400/80">WPM</span>
                </span>
                <span className="text-xs text-amber-300/80 font-mono">{top1.accuracy}% accuracy · {top1.dateStr}</span>
              </>
            ) : (
              <span className="text-xs text-slate-500 my-4">No records logged</span>
            )}
          </div>

          {/* Rank 3 */}
          <div className="order-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-amber-900/40 text-amber-500 font-bold flex items-center justify-center text-xs mb-2">
              🥉 3rd
            </div>
            {top3 ? (
              <>
                <span className="text-sm font-bold text-white truncate max-w-full">{top3.nickname}</span>
                <span className="text-3xl font-extrabold text-slate-200 font-mono tabular-nums my-1">
                  {top3.netWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">{top3.accuracy}% accuracy · {top3.dateStr}</span>
              </>
            ) : (
              <span className="text-xs text-slate-500 my-4">No third record yet</span>
            )}
          </div>
        </div>
      )}

      {/* Detailed Table */}
      {sorted.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <Medal className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No attempts for {filterMode === 'practice' ? 'Practice' : `${filterMode}s`} mode yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Complete your first typing challenge above to log a personal score on this leaderboard!
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-mono uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Typist</th>
                <th className="py-3 px-4 text-right">Net WPM</th>
                <th className="py-3 px-4 text-right">Gross WPM</th>
                <th className="py-3 px-4 text-right">Accuracy</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sorted.map((item, idx) => {
                const isYou = item.nickname === currentNickname;
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isYou ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-bold text-slate-400">
                      {idx === 0 && '🥇'}
                      {idx === 1 && '🥈'}
                      {idx === 2 && '🥉'}
                      {idx > 2 && `#${idx + 1}`}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.nickname}</span>
                        {isYou && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            YOU
                          </span>
                        )}
                        {item.isPersonalBest && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            PB
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-cyan-400 tabular-nums text-sm">
                      {item.netWpm}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 tabular-nums">
                      {item.grossWpm}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-300 tabular-nums">
                      {item.accuracy}%
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 tabular-nums">
                      {item.dateStr}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
