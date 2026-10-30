import React, { useState } from 'react';
import type { Task, TaskStatus } from '../../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onReorder: (reorderedTasks: Task[]) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onStatusChange,
  onEdit,
  onReorder,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (_: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedTasks = [...tasks];
    const [draggedItem] = updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    onReorder(updatedTasks);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
        <span className="text-4xl block mb-2">📋</span>
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
          No tasks match your selection
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Try clearing your search query, adjusting your filters, or adding a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
};