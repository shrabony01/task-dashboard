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
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.setData('text/plain', `${index}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) return;

    const listCopy = [...tasks];
    const [movedItem] = listCopy.splice(draggedIdx, 1);
    listCopy.splice(targetIndex, 0, movedItem);

    setDraggedIdx(null);
    onReorder(listCopy);
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
        <div
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className="transition-transform duration-150"
        >
          <TaskItem
            task={task}
            index={index}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDragStart={() => {}}
            onDragEnter={() => {}}
            onDragEnd={() => {}}
          />
        </div>
      ))}
    </div>
  );
};