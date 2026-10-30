## Task Management Dashboard SBA-9

Hi! This is my Skills-Based Assessment (SBA) submission for the React & TypeScript module. I built an interactive Task Management Dashboard designed to handle everyday task tracking with responsive UI feedback, controlled form validations, dynamic filtering, drag-and-drop reordering, and browser storage persistence.

## What the Application Does

Task Overview & Metrics: Real-time summary cards at the top calculating total tasks, active tasks, completed items, and overdue work alongside a completion progress bar.

Form with Real-Time Feedback: A controlled form component that validates inputs (title length, description restrictions, and due date selection) before allowing submissions. It also supports editing existing tasks seamlessly.

Dynamic Search & Multi-Level Filtering: Search tasks on the fly with text matching, or filter down by status (todo, in-progress, completed) and priority (low, medium, high).

Drag-and-Drop Task Reordering: Built with native HTML5 drag events so tasks can be rearranged visually without third-party libraries.

Data Persistence & Portability: Tasks are automatically saved to localStorage. You can also export your current task list as a .json backup file and import previously saved files directly into the UI.

Light & Dark Theme: Toggle button in the header that switches 

### SBA Reflection: 

## 1. How I Implemented React and TypeScript Features

In this project, my main goal was to build a clean, real-world task dashboard while maintaining strict type safety without relying on `any`.

* **Centralized TypeScript Architecture (`src/types/index.ts`)**:
  I defined strict types and interfaces before writing UI code. This included the `Task` object, `TaskFormData` for handling controlled inputs, `TaskFilterOptions` for managing search and sorting criteria, and `TaskStatistics` for dashboard metrics. Using string literal unions like `type PriorityLevel = 'low' | 'medium' | 'high'` and `type TaskStatus = 'todo' | 'in-progress' | 'completed'` prevented invalid values across the entire component tree.

* **Controlled Components and Form Handling**:
  The `TaskForm` component uses controlled inputs tied to a typed state (`TaskFormData`). I added touch-state tracking (`touched`) paired with a dedicated validation helper (`validateTaskForm`). This delivers live inline error messages for missing titles, title length limits (3–80 characters), and due date formatting, while also serving both task creation and task editing modes seamlessly.

* **Performance Optimization with `useMemo`**:
  Rather than recalculating metrics and filtering tasks during every render, I used `useMemo` in `App.tsx` for `filteredTasks` and `stats`. Derived state recalculates only when `tasks` or `filters` actually change.

---

## 2. Challenges I Encountered and How I Overcame Them

* **Challenge 1: HTML5 Drag-and-Drop Reordering with Active Sort Rules**
  * *The Problem*: When I initially implemented native HTML5 drag-and-drop, dragging a card didn't update the visible list order. I realized that my sorting function was immediately overriding the array order because the default sort was set to "Newest First" (sorting by creation date).
  * *The Solution*: I introduced a `'custom'` sort option to `SortOption` and updated `filterAndSortTasks` so it preserves the array order when in custom mode. When the user drops a card (`handleDrop`), `App.tsx` sets the sort dropdown to "Custom (Drag & Drop)" and updates the master tasks array using array splicing, making reordering work smoothly.

* **Challenge 2: Strict TypeScript Compiler Rules (`tsc -b`)**
  * *The Problem*: During `npm run build`, Vite's TypeScript compiler failed with errors `TS6196: 'PriorityLevel' is declared but never used` in `TaskForm.tsx`.
  * *The Solution*: Because `TaskFormData` already encapsulated `PriorityLevel` and `TaskStatus`, having them imported separately was redundant. I cleaned up the unused type imports, ensuring `npm run build` completed with zero compiler errors.

* **Challenge 3: Preserving Filter Integrity During Reordering**
  * *The Problem*: If a user drags an item while filtering by "High Priority", reordering only that filtered subset could accidentally overwrite tasks of other priorities.
  * *The Solution*: In `handleReorder`, I mapped over the reordered subset and used a `Set` of IDs to reconcile them against the primary task list, ensuring unselected tasks are never erased.

---

## 3. My Approach to Component Composition and State Management

* **Single Source of Truth & Unidirectional Data Flow**:
  I kept `App.tsx` as the single owner of the primary state (`tasks`, `filters`, `editingTask`, `isDark`). Child components remain focused on their specific roles:
  * `Dashboard`: Visualizes progress and aggregates summary cards.
  * `TaskFilter`: Handles text search, category buttons, and sort selectors.
  * `TaskForm`: Manages input entries, validation feedback, and edit/create submissions.
  * `TaskList` & `TaskItem`: Render tasks, handle status cycling, and support drag handles.

* **Separation of Concerns (`src/utils/taskUtils.ts`)**:
  I isolated non-visual business logic away from React components. All filtering logic, date formatting, validation rules, and `localStorage` JSON read/write operations live inside `taskUtils.ts`. This makes the code modular, readable, and easy to maintain.

* **Light and Dark Mode Integration**:
  Instead of injecting theme styles into every component, I implemented Tailwind's class-based dark mode by updating `document.documentElement.classList` inside a `useEffect`. Both the theme choice and task data persist across browser refreshes via `localStorage`.