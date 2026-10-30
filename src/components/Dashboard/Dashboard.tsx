import React from 'react';
import type { TaskStatistics } from '../../types';

interface DashboardProps {
  stats: TaskStatistics;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onExport, onImport }) => {
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cards = [
    { label: 'Total Tasks', value: stats.total, color: 'text-slate-800 dark:text-slate-100', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
    { label: 'In Progress', value: stats.inProgress, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
    { label: 'Completed', value: stats.completed, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
    { label: 'Overdue', value: stats.overdue, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${card.bg} transition-all hover:scale-[1.01]`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {card.label}
            </p>
            <p className={`text-2xl font-black mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar & Data Backup Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="w-full sm:w-1/2">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            <span>Overall Completion</span>
            <span>{completionRate}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Import & Export controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="cursor-pointer px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors">
            📥 Import JSON
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
          </label>
          <button
            onClick={onExport}
            className="px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors"
          >
            📤 Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};