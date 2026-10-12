import React, { useState } from 'react';
import { TestResult, UserSettings } from '../types';
import { getLifetimeStats, getPersonalBests, exportDataAsJson, importDataFromJson } from '../utils/storage';
import { Activity, Clock, Target, Zap, Download, Upload, Trash2, Award } from 'lucide-react';

interface DashboardViewProps {
  results: TestResult[];
  settings: UserSettings;
  onClearAll: () => void;
  onRefreshData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  results,
  settings,
  onClearAll,
  onRefreshData,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const stats = getLifetimeStats(results);
  const pbs = getPersonalBests(results);

  // Format time
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remainMins = mins % 60;
      return `${hrs}h ${remainMins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const handleExport = () => {
    const jsonStr = exportDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typerush_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataFromJson(content);
      if (success) {
        setImportMessage('Data imported successfully!');
        onRefreshData();
      } else {
        setImportMessage('Failed to import data: invalid file format.');
      }
      setTimeout(() => setImportMessage(null), 3000);
    };
    reader.readAsText(file);
  };

  // Recent 15 attempts for progression curve
  const recentTests = [...results].slice(0, 15).reverse();

  return (
    <div className="w-full max-w-4xl mx-auto py-6 animate-fade-in">
      {/* Header with Export/Import */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-7 h-7 text-cyan-400" />
            <span>Personal Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Lifetime typing metrics, duration breakdown, and progress over time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export all data as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export JSON</span>
          </button>

          <label className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          {results.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/50 rounded-lg transition-colors cursor-pointer"
              title="Clear all data"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {importMessage && (
        <div className="mb-6 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs text-center font-mono">
          {importMessage}
        </div>
      )}

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Reset Entire History?</h3>
            <p className="text-sm text-slate-400 mb-6">
              This will remove all test records, statistics, and personal bests from localStorage.
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
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">All-Time Best</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {stats.bestWpm} <span className="text-sm font-normal text-slate-400">WPM</span>
          </span>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">Peak Net Speed</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Average Speed</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {stats.avgWpm} <span className="text-sm font-normal text-slate-400">WPM</span>
          </span>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">Across {stats.totalTests} tests</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Avg Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {stats.avgAccuracy}%
          </span>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">Precision consistency</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Time Practiced</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {formatTime(stats.totalTimeSeconds)}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">{stats.totalChars.toLocaleString()} characters</span>
        </div>
      </div>

      {/* Personal Records by Duration */}
      <div className="mb-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Personal Bests By Duration</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { key: '15', label: '15s Sprint' },
            { key: '30', label: '30s Classic' },
            { key: '60', label: '60s Standard' },
            { key: '120', label: '120s Marathon' },
            { key: 'practice', label: 'Practice' },
          ].map(({ key, label }) => {
            const pb = pbs[key];
            return (
              <div key={key} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col">
                <span className="text-[11px] text-slate-400 font-medium">{label}</span>
                <span className="text-2xl font-extrabold text-white font-mono tabular-nums my-1">
                  {pb && pb.wpm > 0 ? (
                    <>
                      {pb.wpm} <span className="text-xs font-normal text-slate-400">WPM</span>
                    </>
                  ) : (
                    '—'
                  )}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {pb && pb.wpm > 0 ? `${pb.accuracy}% · ${pb.dateStr}` : 'No attempt yet'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Chart (Recent Tests) */}
      {recentTests.length > 1 && (
        <div className="mb-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider">
                Recent Test Progression
              </h3>
              <p className="text-xs text-slate-500">Speed trend over your last {recentTests.length} tests</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Target: {stats.bestWpm} WPM</span>
          </div>

          {/* SVG Sparkline Graph */}
          <div className="h-44 w-full">
            <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="progGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[40, 60, 80, 100, 120].map((lineVal) => {
                const maxVal = Math.max(...recentTests.map((t) => t.netWpm), 100) * 1.1;
                const y = 140 - (lineVal / maxVal) * 120;
                if (y < 10 || y > 150) return null;
                return (
                  <g key={lineVal}>
                    <line x1="30" y1={y} x2="570" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                    <text x="24" y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                      {lineVal}
                    </text>
                  </g>
                );
              })}

              {(() => {
                const maxVal = Math.max(...recentTests.map((t) => t.netWpm), 100) * 1.1;
                const innerW = 540;
                const padX = 30;

                const points = recentTests.map((t, idx) => {
                  const x = padX + (idx / (recentTests.length - 1)) * innerW;
                  const y = 140 - (t.netWpm / maxVal) * 120;
                  return { x, y, ...t };
                });

                const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');
                const areaD = `${pathD} L ${points[points.length - 1].x},140 L ${padX},140 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#progGradient)" />
                    <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                    {points.map((pt, i) => (
                      <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#06b6d4" stroke="#0f172a" strokeWidth="1.5">
                        <title>{`${pt.netWpm} WPM (${pt.accuracy}% acc) - ${pt.mode === 'practice' ? 'Practice' : `${pt.mode}s`}`}</title>
                      </circle>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      )}

      {/* Recent History Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider mb-4">
          Recent Attempts History
        </h3>

        {results.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No typing attempts logged yet. Complete a test above to start your journey!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Net WPM</th>
                  <th className="py-2.5 px-3 text-right">Gross WPM</th>
                  <th className="py-2.5 px-3 text-right">Accuracy</th>
                  <th className="py-2.5 px-3 text-right">Chars</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {results.slice(0, 10).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400">{r.dateStr}</td>
                    <td className="py-2.5 px-3 text-cyan-300 font-semibold">
                      {r.mode === 'practice' ? 'Practice' : `${r.mode}s`}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 capitalize">{r.category}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white tabular-nums">
                      {r.netWpm}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400 tabular-nums">
                      {r.grossWpm}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 tabular-nums">
                      {r.accuracy}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400 tabular-nums">
                      {r.correctChars}/{r.totalChars}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
