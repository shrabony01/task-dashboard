import React, { useState } from 'react';
import type { Task, TaskStatus } from '../../types';
import { formatDate } from '../../utils/taskUtils';

interface TaskItemProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, nextStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  onDelete,
  onStatusChange,
  onEdit,
  onDragStart,
  onDragOver,
  onDragEnd,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Badge styles based on priority
  const priorityStyles = {
    low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    high: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  }[task.priority];

  const isOverdue =
    new Date(task.dueDate + 'T23:59:59') < new Date() && task.status !== 'completed';

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(task.id), 200);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`group relative flex flex-col md:flex-row md:items-center justify-between p-4 mb-3 rounded-xl border bg-white dark:bg-slate-800 transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md ${
        isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      } ${
        task.status === 'completed'
          ? 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Left section: drag handle, status toggle, details */}
      <div className="flex items-start gap-3 flex-1">
        {/* Visual Drag Handle */}
        <div
          title="Drag to reorder"
          className="text-slate-400 hover:text-slate-600 dark:text-slate-500 mt-1 select-none cursor-grab"
        >
          ⋮⋮
        </div>

        {/* Status Checkbox Button */}
        <button
          onClick={() => {
            const nextStatus: TaskStatus =
              task.status === 'completed'
                ? 'todo'
                : task.status === 'todo'
                ? 'in-progress'
                : 'completed';
            onStatusChange(task.id, nextStatus);
          }}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.status === 'completed'
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : task.status === 'in-progress'
              ? 'border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-950/30'
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
          }`}
          aria-label={`Current status: ${task.status}. Click to advance.`}
        >
          {task.status === 'completed' && <span className="text-xs font-bold">✓</span>}
          {task.status === 'in-progress' && <span className="text-xs font-bold">●</span>}
        </button>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`font-semibold text-base tracking-tight ${
                task.status === 'completed'
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h4>

            {/* Priority Tag */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium border uppercase tracking-wider ${priorityStyles}`}
            >
              {task.priority}
            </span>

            {/* Overdue Alert */}
            {isOverdue && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800">
                Overdue
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
            <span>📅 Due: {formatDate(task.dueDate)}</span>
            <span>
              Status:{' '}
              <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                {task.status}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center gap-2 mt-4 md:mt-0 pl-9 md:pl-0">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => onEdit(task)}
          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};