import React from 'react';
import { WpmPoint } from '../types';

interface WpmTimelineChartProps {
  timeline: WpmPoint[];
  averageWpm: number;
}

export const WpmTimelineChart: React.FC<WpmTimelineChartProps> = ({ timeline, averageWpm }) => {
  if (!timeline || timeline.length < 2) {
    return (
      <div className="h-44 w-full flex items-center justify-center text-slate-500 text-sm">
        Not enough test data points to plot timeline
      </div>
    );
  }

  const maxWpm = Math.max(...timeline.map((p) => p.wpm), 40, averageWpm * 1.15);
  const minWpm = 0;
  const height = 180;
  const width = 600;
  const padX = 40;
  const padY = 24;

  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = timeline.map((pt, i) => {
    const x = padX + (i / (timeline.length - 1)) * innerW;
    const y = padY + innerH - ((pt.wpm - minWpm) / (maxWpm - minWpm || 1)) * innerH;
    return { x, y, ...pt };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)},${height - padY} L ${padX},${height - padY} Z`;

  const avgY = padY + innerH - ((averageWpm - minWpm) / (maxWpm - minWpm || 1)) * innerH;

  return (
    <div className="w-full relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padY + innerH * (1 - ratio);
          const val = Math.round(minWpm + ratio * (maxWpm - minWpm));
          return (
            <g key={idx}>
              <line
                x1={padX}
                y1={y}
                x2={width - padX}
                y2={y}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.4"
              />
              <text x={padX - 8} y={y + 3} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                {val}
              </text>
            </g>
          );
        })}

        {/* Average reference line */}
        {averageWpm > 0 && (
          <g>
            <line
              x1={padX}
              y1={avgY}
              x2={width - padX}
              y2={avgY}
              stroke="#eab308"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.8"
            />
            <text x={width - padX + 6} y={avgY + 3} fill="#eab308" fontSize="10" textAnchor="start" fontFamily="monospace">
              avg {Math.round(averageWpm)}
            </text>
          </g>
        )}

        {/* Area fill */}
        <path d={areaD} fill="url(#wpmGradient)" />

        {/* Main curve */}
        <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Individual point dots */}
        {points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="3.5"
            fill="#06b6d4"
            stroke="#0f172a"
            strokeWidth="1.5"
            className="hover:r-5 transition-all"
          >
            <title>{`Second ${pt.second}s: ${pt.wpm} WPM (${pt.accuracy}% acc)`}</title>
          </circle>
        ))}
      </svg>
      <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono mt-1 px-8">
        <span>Start (0s)</span>
        <span>Timeline Progression</span>
        <span>Finish ({timeline[timeline.length - 1].second}s)</span>
      </div>
    </div>
  );
};
