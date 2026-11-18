import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Task, 
  Category, 
  Priority, 
  ViewFilter, 
  SortField, 
  SortOrder 
} from './types/todo';
import { 
  loadTasks, 
  saveTasks, 
  loadCategories, 
  saveCategories, 
  DEFAULT_CATEGORIES, 
  INITIAL_TASKS 
} from './utils/storage';
import { isToday, isOverdue, getTodayDateString } from './utils/date';
import { soundManager } from './utils/audio';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { CategoryModal } from './components/CategoryModal';
import { StatsModal } from './components/StatsModal';
import { ShortcutsModal } from './components/ShortcutsModal';

const PRIORITY_WEIGHTS: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const App: React.FC = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [categories, setCategories] = useState<Category[]>(() => loadCategories());
  
  // Filtering & View State
  const [currentView, setCurrentView] = useState<ViewFilter>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Modals & UI State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskflow_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => soundManager.isSoundEnabled());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Bulk actions selection
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync tasks & categories to storage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('taskflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('taskflow_theme', 'light');
    }
  }, [isDarkMode]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput = activeElement instanceof HTMLInputElement || 
                      activeElement instanceof HTMLTextAreaElement || 
                      activeElement instanceof HTMLSelectElement;

      if (e.key === 'Escape') {
        if (isTaskModalOpen) setIsTaskModalOpen(false);
        else if (isCategoryModalOpen) setIsCategoryModalOpen(false);
        else if (isStatsModalOpen) setIsStatsModalOpen(false);
        else if (isShortcutsModalOpen) setIsShortcutsModalOpen(false);
        else if (selectedTaskIds.length > 0) setSelectedTaskIds([]);
        else if (searchQuery) setSearchQuery('');
        return;
      }

      if (isInput) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingTask(null);
        setIsTaskModalOpen(true);
      } else if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setIsDarkMode((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsSoundEnabled(soundManager.toggleSound());
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, isCategoryModalOpen, isStatsModalOpen, isShortcutsModalOpen, selectedTaskIds, searchQuery]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((t) => {
      t.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [tasks]);

  // View & Category counts
  const counts = useMemo(() => {
    let today = 0;
    let upcoming = 0;
    let overdue = 0;
    let completed = 0;
    const byCategory: Record<string, number> = {};

    tasks.forEach((t) => {
      if (t.completed) {
        completed++;
      } else {
        if (isToday(t.dueDate)) today++;
        if (t.dueDate && !isToday(t.dueDate) && !isOverdue(t.dueDate, t.dueTime)) upcoming++;
        if (isOverdue(t.dueDate, t.dueTime)) overdue++;

        if (t.categoryId) {
          byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + 1;
        }
      }
    });

    return {
      all: tasks.filter((t) => !t.completed).length,
      today,
      upcoming,
      overdue,
      completed,
      byCategory,
    };
  }, [tasks]);

  // Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. View Filter
      if (currentView === 'completed') {
        if (!task.completed) return false;
      } else if (currentView === 'today') {
        if (task.completed) return false;
        if (!isToday(task.dueDate) && !isOverdue(task.dueDate, task.dueTime)) return false;
      } else if (currentView === 'upcoming') {
        if (task.completed) return false;
        if (!task.dueDate || isToday(task.dueDate) || isOverdue(task.dueDate, task.dueTime)) return false;
      } else if (currentView === 'overdue') {
        if (task.completed) return false;
        if (!isOverdue(task.dueDate, task.dueTime)) return false;
      } else {
        // 'all' view: show active and completed
      }

      // 2. Category Filter
      if (selectedCategoryId && task.categoryId !== selectedCategoryId) {
        return false;
      }

      // 3. Priority Filter
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
        return false;
      }

      // 4. Tag Filter
      if (selectedTag && (!task.tags || !task.tags.includes(selectedTag))) {
        return false;
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query) ?? false;
        const matchesTag = task.tags?.some((t) => t.toLowerCase().includes(query)) ?? false;
        if (!matchesTitle && !matchesDesc && !matchesTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      let compare = 0;
      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? `${a.dueDate} ${a.dueTime || '23:59'}` : '9999-99-99';
        const dateB = b.dueDate ? `${b.dueDate} ${b.dueTime || '23:59'}` : '9999-99-99';
        compare = dateA.localeCompare(dateB);
      } else if (sortBy === 'priority') {
        compare = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
      } else if (sortBy === 'createdAt') {
        compare = b.createdAt.localeCompare(a.createdAt);
      } else if (sortBy === 'title') {
        compare = a.title.localeCompare(b.title);
      }

      return sortOrder === 'asc' ? compare : -compare;
    });
  }, [tasks, currentView, selectedCategoryId, selectedPriority, selectedTag, searchQuery, sortBy, sortOrder]);

  // Handlers
  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            // Check if high/urgent priority or last task
            if (t.priority === 'urgent' || t.priority === 'high') {
              confetti({
                particleCount: 60,
                spread: 55,
                origin: { y: 0.7 },
              });
            }
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null,
          };
        }
        return t;
      })
    );
  };

  const handleTogglePin = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s
            ),
          };
        }
        return t;
      })
    );
  };

  const handleAddSubtask = (taskId: string, subtaskTitle: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSub = {
            id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            title: subtaskTitle,
            completed: false,
          };
          return {
            ...t,
            subtasks: [...t.subtasks, newSub],
          };
        }
        return t;
      })
    );
  };

  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
          };
        }
        return t;
      })
    );
  };

  const handleQuickAdd = (title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      completed: false,
      priority: selectedPriority !== 'all' ? selectedPriority : 'medium',
      categoryId: selectedCategoryId || (categories[0]?.id ?? 'cat-work'),
      dueDate: currentView === 'today' ? getTodayDateString() : undefined,
      createdAt: new Date().toISOString(),
      isPinned: false,
      subtasks: [],
      tags: selectedTag ? [selectedTag] : [],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt'>,
    editingTaskId?: string
  ) => {
    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                ...taskData,
              }
            : t
        )
      );
    } else {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  // Bulk actions
  const handleSelectTask = (taskId: string, selected: boolean) => {
    if (selected) {
      setSelectedTaskIds((prev) => [...prev, taskId]);
    } else {
      setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleSelectAll = () => {
    setSelectedTaskIds(filteredTasks.map((t) => t.id));
  };

  const handleDeselectAll = () => {
    setSelectedTaskIds([]);
  };

  const handleBulkComplete = () => {
    setTasks((prev) =>
      prev.map((t) =>
        selectedTaskIds.includes(t.id)
          ? { ...t, completed: true, completedAt: new Date().toISOString() }
          : t
      )
    );
    soundManager.playComplete();
    confetti({ particleCount: 80, spread: 60 });
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    setTasks((prev) => prev.filter((t) => !selectedTaskIds.includes(t.id)));
    soundManager.playDelete();
    setSelectedTaskIds([]);
  };

  // Categories
  const handleAddCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    }
  };

  // Export / Import / Reset
  const handleExportData = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks,
      categories,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.tasks)) {
          setTasks(parsed.tasks);
        }
        if (Array.isArray(parsed.categories)) {
          setCategories(parsed.categories);
        }
        alert('Data successfully imported!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (window.confirm('Reset all tasks and categories to demo data? Your current changes will be overwritten.')) {
      setTasks(INITIAL_TASKS);
      setCategories(DEFAULT_CATEGORIES);
      setSelectedCategoryId(null);
      setSelectedTag(null);
      setCurrentView('all');
    }
  };

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(soundManager.toggleSound())}
        onOpenNewTaskModal={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onOpenStatsModal={() => setIsStatsModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        searchInputRef={searchInputRef}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          selectedPriority={selectedPriority}
          onSelectPriority={setSelectedPriority}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          categories={categories}
          onOpenAddCategoryModal={() => setIsCategoryModalOpen(true)}
          counts={counts}
          tags={allTags}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onResetData={handleResetData}
          isOpenOnMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto">
          <TaskList
            tasks={filteredTasks}
            categories={categories}
            currentView={currentView}
            selectedCategory={currentCategory}
            selectedPriority={selectedPriority}
            selectedTag={selectedTag}
            searchQuery={searchQuery}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortBy(field);
              setSortOrder(order);
            }}
            selectedTaskIds={selectedTaskIds}
            onSelectTask={handleSelectTask}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBulkComplete={handleBulkComplete}
            onBulkDelete={handleBulkDelete}
            onQuickAdd={handleQuickAdd}
            onToggleComplete={handleToggleComplete}
            onTogglePin={handleTogglePin}
            onEdit={(task) => {
              setEditingTask(task);
              setIsTaskModalOpen(true);
            }}
            onDelete={handleDeleteTask}
            onToggleSubtask={handleToggleSubtask}
            onAddSubtask={handleAddSubtask}
            onDeleteSubtask={handleDeleteSubtask}
            onOpenNewTaskModal={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
          />
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
        categories={categories}
        defaultCategoryId={selectedCategoryId || undefined}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        tasks={tasks}
        categories={categories}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
};

export default App;
