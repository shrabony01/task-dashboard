import { Task, TaskFilterOptions, TaskFormData, FormErrors, TaskStatistics, PriorityLevel } from '../types';

const STORAGE_KEY = 'task_dashboard_data_v1';
const THEME_KEY = 'task_dashboard_theme';

export const loadTaskFromStorage = (): Task [] =>{
    try{
        const raw = localStorage.getItem(STORAGE_KEY);
        if(!raw) return getDefaultTasks();
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : getDefaultTasks();

    }catch(error){
        console.error('Failed to load tasks from localStorage', error);
        return getDefaultTasks();
    }
};

// saves task list to localstorage

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage', error);
  }
};

// theme storage utilities

export const loadThemeFromStorage = (): boolean => {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme) return theme === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const saveThemeToStorage = (isDark: boolean): void => {
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
};

//Validates Task Form values and returns field-level error messages
export const validateTaskForm = (formData: TaskFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  } else if (formData.title.trim().length > 80) {
    errors.title = 'Title cannot exceed 80 characters';
  }

  if (formData.description.trim().length > 300) {
    errors.description = 'Description cannot exceed 300 characters';
  }

  if (!formData.dueDate) {
    errors.dueDate = 'Due date is required';
  } else {
    const date = new Date(formData.dueDate);
    if (isNaN(date.getTime())) {
      errors.dueDate = 'Invalid date format';
    }
  }

  return errors;
};

//rank map for sorting operation
const priorityWeight: Record<PriorityLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
};
//Filters and sorts tasks based on user criteria
export const filterAndSortTasks = (tasks: Task[], filters: TaskFilterOptions): Task[] => {
  return tasks
    .filter((task) => {
      // Search matching title or description
      const searchLower = filters.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower);

      // Status matching
      const matchesStatus = filters.status === 'all' || task.status === filters.status;

      // Priority matching
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'dueDateAsc':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'dueDateDesc':
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'priorityDesc':
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        case 'createdDesc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
};

//formats a raw date string

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// mock tasks for immediate evaluation

export const getDefaultTasks = (): Task[] => [
  {
    id: 'task-1',
    title: 'Set up Vite & Tailwind CSS Architecture',
    description: 'Ensure TypeScript strict mode and dark mode classes are active.',
    priority: 'high',
    status: 'completed',
    dueDate: '2026-10-25',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Implement Custom Drag & Drop Reordering',
    description: 'Provide intuitive visual feedback when dragging tasks across positions.',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2026-10-31',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Write Technical Documentation and Reflection',
    description: 'Document design choices, state patterns, and TS interfaces in REFLECTION.md',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-11-02',
    createdAt: new Date().toISOString(),
  },
];