import type{
  Task,
  TaskFilterOptions,
  TaskFormData,
  FormErrors,
  TaskStatistics,
  PriorityLevel,
} from '../types';

const STORAGE_KEY = 'task_dashboard_data_v1';
const THEME_KEY = 'task_dashboard_theme';

const priorityWeight: Record<PriorityLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const getDefaultTasks = (): Task[] => [
  {
    id: 'task-1',
    title: 'Scaffold React & TypeScript Architecture',
    description: 'Set up Vite, organize folder structure, and configure strict types.',
    priority: 'high',
    status: 'completed',
    dueDate: '2026-10-25',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Implement Task Drag & Drop Reordering',
    description: 'Enable native HTML5 drag and drop across the task list items.',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2026-10-31',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Write Reflection Document',
    description: 'Document design choices, state patterns, and TS interfaces in REFLECTION.md.',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-11-02',
    createdAt: new Date().toISOString(),
  },
];

export const loadTasksFromStorage = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultTasks();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getDefaultTasks();
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return getDefaultTasks();
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

export const loadThemeFromStorage = (): boolean => {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme) return theme === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const saveThemeToStorage = (isDark: boolean): void => {
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
};

export const validateTaskForm = (formData: TaskFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (formData.title.trim().length > 80) {
    errors.title = 'Title must not exceed 80 characters';
  }

  if (formData.description.trim().length > 300) {
    errors.description = 'Description must not exceed 300 characters';
  }

  if (!formData.dueDate) {
    errors.dueDate = 'Due date is required';
  } else {
    const parsedDate = new Date(formData.dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.dueDate = 'Please select a valid date';
    }
  }

  return errors;
};

export const filterAndSortTasks = (
  tasks: Task[],
  filters: TaskFilterOptions
): Task[] => {
  return tasks
    .filter((task) => {
      const query = filters.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);

      const matchesStatus =
        filters.status === 'all' || task.status === filters.status;

      const matchesPriority =
        filters.priority === 'all' || task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'custom':
          return 0;
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

export const computeStatistics = (tasks: Task[]): TaskStatistics => {
  const today = new Date().toISOString().split('T')[0];

  return tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      if (task.status === 'completed') acc.completed += 1;
      if (task.status === 'in-progress') acc.inProgress += 1;
      if (task.status === 'todo') acc.todo += 1;
      if (task.priority === 'high') acc.highPriority += 1;
      if (task.dueDate < today && task.status !== 'completed') acc.overdue += 1;
      return acc;
    },
    { total: 0, completed: 0, inProgress: 0, todo: 0, highPriority: 0, overdue: 0 }
  );
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};