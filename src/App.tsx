import React, { useState, useEffect, useMemo } from 'react';
import type { Task, TaskFormData, TaskFilterOptions, TaskStatus } from './types';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadThemeFromStorage,
  saveThemeToStorage,
  filterAndSortTasks,
  computeStatistics,
} from './utils/taskUtils';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TaskForm } from './components/TaskForm/TaskForm';
import { TaskFilter } from './components/TaskFilter/TaskFilter';
import { TaskList } from './components/TaskList/TaskList';

const initialFilters: TaskFilterOptions = {
  searchQuery: '',
  status: 'all',
  priority: 'all',
  sortBy: 'createdDesc',
};

export const App: React.FC = () => {
  // Primary State
  const [tasks, setTasks] = useState<Task[]>(loadTasksFromStorage);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilterOptions>(initialFilters);
  const [isDark, setIsDark] = useState<boolean>(loadThemeFromStorage);

  // Sync tasks to LocalStorage on modification
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Sync theme with HTML class attribute and storage
  useEffect(() => {
    saveThemeToStorage(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Derived filtered & sorted tasks
  const filteredTasks = useMemo(
    () => filterAndSortTasks(tasks, filters),
    [tasks, filters]
  );

  // Derived dashboard metrics
  const stats = useMemo(() => computeStatistics(tasks), [tasks]);

  // Task Operations
  const handleCreateOrUpdateTask = (formData: TaskFormData) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...formData } : t))
      );
      setEditingTask(null);
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingTask?.id === id) {
      setEditingTask(null);
    }
  };

  const handleStatusChange = (id: string, nextStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
  };

  const handleReorder = (reorderedTasks: Task[]) => {
    // 1. Switch sort mode to 'custom' so the sort algorithm does not snap cards back
    setFilters((prev) => ({ ...prev, sortBy: 'custom' }));

    // 2. Map reordered items back to the master tasks state
    const reorderedIds = new Set(reorderedTasks.map((t) => t.id));
    const unaffectedTasks = tasks.filter((t) => !reorderedIds.has(t.id));
    setTasks([...reorderedTasks, ...unaffectedTasks]);
  };

  // JSON Data Backup & Restore
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tasks_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
          alert('Tasks successfully imported!');
        } else {
          alert('Invalid JSON structure: Root must be an array of tasks.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Bar */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Task Management Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Production-ready task tracking with TypeScript, real-time validation, and persistence.
            </p>
          </div>

          {/* Dark Mode Toggle Switch */}
          <button
            onClick={() => setIsDark((prev) => !prev)}
            aria-label="Toggle Theme"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
          >
            <span>{isDark ? '☀️ Light' : '🌙 Dark'}</span>
          </button>
        </header>

        {/* Dashboard Statistics */}
        <Dashboard
          stats={stats}
          onExport={handleExportData}
          onImport={handleImportData}
        />

        {/* Main Content: Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <TaskForm
                initialTask={editingTask}
                onSubmit={handleCreateOrUpdateTask}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>

          {/* Right Column: Filter & Task List */}
          <div className="lg:col-span-2">
            <TaskFilter
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(initialFilters)}
            />
            <TaskList
              tasks={filteredTasks}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onEdit={(task) => setEditingTask(task)}
              onReorder={handleReorder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;