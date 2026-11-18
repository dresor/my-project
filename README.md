# TaskFlow • Modern To-Do & Task Management App

TaskFlow is a fast, responsive, and feature-rich task and project management web application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**.

![TaskFlow Preview](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/check-circle-2.svg)

---

## ✨ Features

- 📋 **Comprehensive Task Management**
  - Create, edit, and organize tasks with titles, descriptions, due dates, and times.
  - Priority levels with distinct color-coded badges: **Urgent**, **High**, **Medium**, and **Low**.
  - Pin important tasks to the top of your list.
  - Subtask checklists with instant inline progress tracking and direct checkbox toggles.

- 🗂️ **Smart Views & Categorization**
  - **All Tasks**, **Today**, **Upcoming**, **Overdue**, and **Completed** smart views.
  - Preloaded categories: *Work*, *Personal*, *Projects*, *Shopping*, and *Health & Fitness*.
  - Create and manage custom categories with customizable color swatches.
  - Tagging system with tag filtering.

- ⚡ **Productivity Boosters & Quick Actions**
  - Instant **Quick-Add** bar at the top of the list (press Enter to immediately add).
  - Real-time search across titles, descriptions, and tags.
  - Multi-criteria sorting (by Due Date, Priority, Creation Date, or Alphabetical) with ascending/descending toggle.
  - Bulk actions: Select all, bulk mark done, bulk delete.

- 📊 **Productivity Statistics Dashboard**
  - Real-time completion rate meter and progress tracking.
  - Active, done today, and overdue metrics.
  - Priority breakdown and category completion distribution.
  - Celebratory confetti effects on task completions.

- 🔊 **Offline Web Audio Effects**
  - Synthesized audio feedback (rising harmonic chime on completion, pop on task creation, soft whoosh on delete) powered by the Web Audio API without external audio files.
  - One-click mute/unmute toggle.

- 🎨 **Modern Design & Dark Mode**
  - Polished responsive UI styled with Tailwind CSS and Plus Jakarta Sans typography.
  - Light and Dark mode toggle with system preference detection and persistence.

- 💾 **Data Persistence & Portability**
  - Automatic `localStorage` synchronization.
  - **Export to JSON** backup file.
  - **Import from JSON** file.
  - Reset to sample demo data at any time.

- ⌨️ **Keyboard Shortcuts**
  - <kbd>N</kbd> — Create a new task
  - <kbd>/</kbd> — Focus the search bar
  - <kbd>D</kbd> — Toggle dark / light mode
  - <kbd>M</kbd> — Toggle audio feedback
  - <kbd>Ctrl</kbd> + <kbd>Enter</kbd> — Save task in modal
  - <kbd>Esc</kbd> — Close dialogs or clear selection
  - <kbd>?</kbd> — Open keyboard shortcuts guide

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Type check and build optimized static assets
npm run build

# Preview production build locally
npm run preview
```

### Running Tests

```bash
# Run unit and integration tests with Vitest
npm test
```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Testing**: [Vitest](https://vitest.dev/) + [JSDOM](https://github.com/jsdom/jsdom)
- **Audio**: Web Audio API (zero external asset dependencies)

---

## 📁 Project Structure

```
.
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── todo.ts          # Core data models and types
    ├── utils/
    │   ├── audio.ts         # Synthesized Web Audio API sound effects
    │   ├── date.ts          # Date helpers & relative labels
    │   ├── date.test.ts     # Date unit tests
    │   ├── storage.ts       # LocalStorage persistence & initial data
    │   └── storage.test.ts  # Storage unit tests
    └── components/
        ├── Header.tsx       # Navigation bar, search, theme & sound toggles
        ├── Sidebar.tsx      # View filters, categories, tags & backup tools
        ├── TaskList.tsx     # Quick-add, sort toolbar, bulk actions & list
        ├── TaskItem.tsx     # Task card, subtasks checklist, status & badges
        ├── TaskModal.tsx    # Modal for creating and editing tasks
        ├── CategoryModal.tsx# Custom category manager
        ├── StatsModal.tsx   # Productivity statistics modal
        └── ShortcutsModal.tsx# Keyboard shortcuts cheatsheet
```

---

## 📄 License

MIT
