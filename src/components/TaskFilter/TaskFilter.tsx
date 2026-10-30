import React from 'react';
import type { TaskFilterOptions, PriorityLevel, TaskStatus, SortOption } from '../../types';

interface TaskFilterProps {
  filters: TaskFilterOptions;
  onChange: (updatedFilters: TaskFilterOptions) => void;
  onReset: () => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ filters, onChange, onReset }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchQuery: e.target.value });
  };

  const handleStatusChange = (status: 'all' | TaskStatus) => {
    onChange({ ...filters, status });
  };

  const handlePriorityChange = (priority: 'all' | PriorityLevel) => {
    onChange({ ...filters, priority });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value as SortOption });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.sortBy !== 'createdDesc';

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 mb-6 transition-colors">
      {/* Search Input & Sort Dropdown */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="🔍 Search tasks by title or details..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-3 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChange({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">
            Sort by:
          </label>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="text-sm bg-slate-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="custom">Custom (Drag & Drop)</option>
            <option value="createdDesc">Newest First</option>
            <option value="dueDateAsc">Due Date (Earliest)</option>
            <option value="dueDateDesc">Due Date (Latest)</option>
            <option value="priorityDesc">Priority (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Filter Pill Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-slate-100 dark:border-slate-700">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 uppercase tracking-wider">
            Status:
          </span>
          {(['all', 'todo', 'in-progress', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => handleStatusChange(st)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                filters.status === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Priority filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 uppercase tracking-wider">
            Priority:
          </span>
          {(['all', 'high', 'medium', 'low'] as const).map((pr) => (
            <button
              key={pr}
              onClick={() => handlePriorityChange(pr)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                filters.priority === pr
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {pr}
            </button>
          ))}
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};