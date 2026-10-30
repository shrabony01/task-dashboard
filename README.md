## Task Management Dashboard SBA-9

Hi! This is my Skills-Based Assessment (SBA) submission for the React & TypeScript module. I built an interactive Task Management Dashboard designed to handle everyday task tracking with responsive UI feedback, controlled form validations, dynamic filtering, drag-and-drop reordering, and browser storage persistence.

## What the Application Does

Task Overview & Metrics: Real-time summary cards at the top calculating total tasks, active tasks, completed items, and overdue work alongside a completion progress bar.

Form with Real-Time Feedback: A controlled form component that validates inputs (title length, description restrictions, and due date selection) before allowing submissions. It also supports editing existing tasks seamlessly.

Dynamic Search & Multi-Level Filtering: Search tasks on the fly with text matching, or filter down by status (todo, in-progress, completed) and priority (low, medium, high).

Drag-and-Drop Task Reordering: Built with native HTML5 drag events so tasks can be rearranged visually without third-party libraries.

Data Persistence & Portability: Tasks are automatically saved to localStorage. You can also export your current task list as a .json backup file and import previously saved files directly into the UI.

Light & Dark Theme: Toggle button in the header that switches 