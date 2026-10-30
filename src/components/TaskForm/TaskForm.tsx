import React, { useState, useEffect } from 'react';
import type { Task, TaskFormData, FormErrors} from '../../types';
import { validateTaskForm } from '../../utils/taskUtils';

interface TaskFormProps {
  initialTask?: Task | null;
  onSubmit: (formData: TaskFormData) => void;
  onCancel: () => void;
}

const emptyForm: TaskFormData = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: new Date().toISOString().split('T')[0],
};

export const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<TaskFormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title,
        description: initialTask.description,
        priority: initialTask.priority,
        status: initialTask.status,
        dueDate: initialTask.dueDate,
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    setTouched({});
  }, [initialTask]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (touched[name]) {
        setErrors(validateTaskForm(next));
      }
      return next;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateTaskForm(formData));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateTaskForm(formData);
    setErrors(validationErrors);
    setTouched({ title: true, description: true, dueDate: true });

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
      setFormData(emptyForm);
      setTouched({});
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
    >
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {initialTask ? '✏️ Edit Task' : '➕ Create New Task'}
        </h3>
        {initialTask && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={() => handleBlur('title')}
            placeholder="e.g., Conduct UX usability audit"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 ${
              touched.title && errors.title
                ? 'border-rose-400 ring-rose-400 focus:ring-rose-500'
                : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
            }`}
          />
          {touched.title && errors.title && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            onBlur={() => handleBlur('description')}
            placeholder="Key notes, context, or deliverables..."
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          />
          {touched.description && errors.description && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.description}</p>
          )}
        </div>

        {/* Priority, Status, and Due Date Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Due Date *
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              onBlur={() => handleBlur('dueDate')}
              className={`w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 ${
                touched.dueDate && errors.dueDate
                  ? 'border-rose-400 ring-rose-400 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
              }`}
            />
            {touched.dueDate && errors.dueDate && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.dueDate}</p>
            )}
          </div>
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {initialTask ? 'Update Task' : 'Add Task'}
          </button>
          {initialTask && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};