# Task Management Dashboard

A responsive, feature-rich **Task Management Dashboard** built with **React 19** and **TypeScript**. It supports full CRUD operations, real-time search and multi-filter, dual view modes (List & Grid), dark/light theme toggle, and data persistence via `localStorage` — entirely frontend with no backend required.

---

## Features

### 1) Landing Page

- A clean welcome screen that greets the user.
- User can optionally enter their **name**, which is stored in `sessionStorage` and displayed in the header as a personalized greeting (e.g., "Welcome, Arvind").
- Clicking **"Get Started"** navigates to the Task Dashboard.

---

### 2) Task Dashboard

**Summary Stats:**
- Displays **3 stat cards** at the top — **Total Tasks**, **Pending Tasks**, and **Completed Tasks**.
- Stats update in real time as tasks are added, edited, or deleted.

**Add Task:**
- Click the **"Add Task"** button in the header to open a modal dialog.
- Form fields:
  - **Title** *(required)*
  - **Description** *(optional)*
  - **Status** — `Todo` / `In Progress` / `Completed`
  - **Priority** — `Low` / `Medium` / `High`
  - **Due Date** — Date picker (minimum date is today for new tasks)
- Validation is powered by **Yup** schema + **react-hook-form**.
- Default values: Status → `Todo`, Priority → `Medium`, Due Date → 7 days from today.

**Edit Task:**
- Each task card has an **Edit** button.
- Opens the same form pre-filled with existing task data.
- Click **"Update Task"** to save changes.

**Delete Task:**
- Each task card has a **Delete** button.
- A **Confirmation Dialog** appears before deletion to prevent accidents.

**Quick Status Update:**
- Each task card has an inline **Status dropdown** — change status directly without opening the edit dialog.

---

### 3) Search & Filtering

**Real-time Search:**
- Search by task **title or description** with a **300ms debounce** to avoid excessive re-renders.

**Filter by Status:**
- Multi-select dropdown — filter tasks by one or multiple statuses at the same time (e.g., show only `Todo` + `In Progress`).

**Filter by Priority:**
- Multi-select dropdown — filter tasks by one or multiple priorities simultaneously.

**Sort Order:**
- Tasks are always sorted **newest first** by creation date.

**Filter Persistence:**
- Active filters and search query are saved to `localStorage` and restored on next visit.

---

### 4) List View & Grid View

Toggle between two display modes:

- **List View** — Virtualized using `react-window`'s `FixedSizeList` for smooth performance even with hundreds of tasks.
- **Grid View** — Responsive CSS grid (1 column on mobile, 2 on tablet, 3 on desktop).

Each task card displays:
- Title, description (truncated), status badge (with color), priority chip (with color), due date chip
- **Overdue tasks** are highlighted with a red due date chip.

---

### 5) Dark / Light Theme

- Toggle between **Dark Mode** and **Light Mode** via the icon in the app header.
- Theme preference is persisted in `localStorage` via Zustand's `persist` middleware.

---

### 6) Data Persistence & Demo Tasks

- All tasks are automatically saved to **`localStorage`** — data survives page refreshes and browser restarts.
- **5 pre-loaded demo tasks** are shown on first visit so the dashboard isn't empty.

---

### 7) Responsive Design

- Fully responsive across **mobile (320px+), tablet, and desktop** screen sizes.
- Built using Material UI's responsive `sx` props, breakpoints, and `useMediaQuery`.

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | React + TypeScript | 19.x / 5.9.x |
| Build Tool | Vite | 7.x |
| UI Library | Material UI (MUI) | 7.x |
| State Management | Zustand (with persist) | 5.x |
| Routing | React Router DOM | 7.x |
| Forms | react-hook-form + Yup | 7.x / 1.x |
| Date Handling | Day.js + MUI X Date Pickers | 1.x / 7.x |
| Virtualized List | react-window | 1.x |
| Linting | ESLint + plugins | 8.x |
| Formatting | Prettier | 3.x |

---

## Project Structure

```
src/
├── app/
│   ├── App.tsx                  # Root component (ThemeProvider, Router)
│   └── router.tsx               # Route definitions (/ and /dashboard)
├── constants/
│   └── task.ts                  # Statuses, priorities, DEMO_TASKS, storage keys
├── features/
│   ├── landing/
│   │   └── pages/
│   │       └── LandingPage.tsx  # Welcome / username entry page
│   └── task/
│       ├── components/
│       │   ├── TaskCard.tsx     # Task card (list & grid variants)
│       │   ├── TaskForm.tsx     # Add / Edit task form
│       │   └── TaskList.tsx     # Search, filters, virtualized list, grid view
│       ├── pages/
│       │   └── TaskDashboard.tsx  # Stat cards + TaskList + Add Task dialog
│       ├── store/
│       │   └── taskStore.ts     # Zustand store — CRUD + localStorage
│       └── types/
│           ├── types.ts         # Core TypeScript interfaces & types
│           └── validation.ts    # Yup schema for task form
├── shared/
│   ├── components/
│   │   ├── AppHeader.tsx        # App bar with Add Task, username, theme toggle
│   │   ├── AppLayout.tsx        # Layout wrapper (AppHeader + Outlet)
│   │   └── ConfirmationDialog.tsx  # Reusable delete-confirm dialog
│   ├── store/
│   │   └── themeStore.ts        # Zustand theme store (dark/light + persist)
│   └── types/
│       ├── dialogTypes.ts       # ConfirmationDialog prop types
│       └── storeTypes.ts        # ThemeMode + ThemeState types
├── styles/
│   └── index.css                # Global reset (box-sizing, margin, font-family)
├── utils/
│   ├── formatter.ts             # kebabToTitleCase(), formatDate()
│   ├── storage.ts               # localStorage / sessionStorage wrappers
│   └── task.ts                  # filterTasksByStatus(), searchTasks(), filterByPriority()
└── external-modules.d.ts        # Module declaration for react-window
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher → [Download here](https://nodejs.org/)
- **Yarn** (recommended):
  ```sh
  npm install -g yarn
  ```
  Or use **npm** (comes with Node.js).

---

### Installation & Setup

**Step 1 — Clone the repository:**
```sh
git clone https://github.com/<your-username>/task-management-dashboard.git
cd task-management-dashboard
```

**Step 2 — Install dependencies:**
```sh
yarn install
```
> Using npm? Run `npm install` instead.

**Step 3 — Start the development server:**
```sh
yarn dev
```
> Using npm? Run `npm run dev` instead.

**Step 4 — Open in your browser:**
```
http://localhost:5173
```

No environment variables, no backend, no database setup required.

---

### Build for Production

```sh
yarn build
```
The production-ready files will be in the `dist/` directory.

```sh
yarn preview
```
Serve the production build locally to verify before deploying.

---

## Available Scripts

| Script | Description |
|---|---|
| `yarn dev` | Start the development server with hot reload |
| `yarn build` | Build the app for production |
| `yarn preview` | Preview the production build locally |
| `yarn lint` | Run ESLint across all source files |
| `yarn lint:fix` | Auto-fix ESLint errors |
| `yarn format` | Format all source files with Prettier |
| `yarn format:check` | Check formatting without making changes |
| `yarn fix` | Run `format` + `lint:fix` together |

---

## How It Works

### Data Flow

```
User Action (Add / Edit / Delete / Filter)
         ↓
  React Component
         ↓
  useTaskStore (Zustand)  ──────────────────► localStorage (auto-persisted)
         ↓
  State update triggers re-render
         ↓
  UI reflects new state
```

### Task Persistence

Tasks are serialized to JSON and stored in `localStorage` under the key `task-management-tasks`. On every page load, Zustand hydrates from this key. If no tasks exist (first visit), the 5 built-in demo tasks are loaded automatically.

### Filter Persistence

The active search query, status filters, and priority filters are saved under `task-management-filter-state` in `localStorage` and restored on the next visit.

### Username Session

The username entered on the landing page is saved in `sessionStorage` (key: `userName`). It is automatically cleared when the browser tab is closed — it does not persist across sessions.

---

## Design Decisions

**Feature-based folder structure**
Code is organized by feature (`landing`, `task`) rather than by type, making the codebase easy to navigate and scale.

**Zustand over Redux**
Lightweight, minimal boilerplate, and excellent TypeScript support — perfectly suited for a frontend-only app of this scale.

**react-window for virtualization**
The list view uses `FixedSizeList` from `react-window` to keep rendering efficient regardless of how many tasks are in the store.

**react-hook-form + Yup**
Minimizes re-renders during form input, while Yup provides a clean declarative validation schema.

**No backend / No auth**
This is an intentionally pure frontend app. All data lives in the browser, making setup trivially simple — just `yarn install && yarn dev`.

---

## Known Limitations

- Data is stored in the browser's `localStorage` — clearing browser data will erase all tasks.
- No synchronization across devices or browsers.
- No user authentication or multi-user support.
- `localStorage` has a ~5MB size limit — sufficient for typical use but could be a constraint with thousands of large-description tasks.

---

## License

This project is licensed under the **MIT License**.
