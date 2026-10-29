//step-1 adding the definition and interfaces

// priority level for tasks
export type PriorityLevel = 'low' | 'medium' | 'high';

// status of tasks
export type TaskStatus = 'todo' | 'in-progress' | 'completed' ;

//type for sorting option

export type SortOption = 'dueDateAsc' | 'dueDateDesc' | 'priorityDesc' | 'createdDesc';

// structure
export interface Task {
    id: string;
    title: string;
    description: string;
    priority: PriorityLevel;
    status: TaskStatus;
    dueDate: string;   // YYYY-MM-DD
    createdAt: string; // timestamp
}
//shape for creating or editing a task

export interface TaskFormData{
    title: string;
    description: string;
    priority: PriorityLevel;
    status: TaskStatus;
    dueDate: string;

}

// for errors
export interface FormErrors {
    title?: string;
    description?: string;
    dueDate? : string;
}

//for filter and search state
export interface TaskFilterOptions {
  searchQuery: string;
  status: 'all' | TaskStatus;
  priority: 'all' | PriorityLevel;
  sortBy: SortOption;
}

//dashboard card
export interface TaskStatistics {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  highPriority: number;
  overdue: number;
}