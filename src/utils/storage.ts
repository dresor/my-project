import { Task, Category } from '../types/todo';
import { getTodayDateString, getTomorrowDateString } from './date';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-work', name: 'Work', color: '#3b82f6', iconName: 'Briefcase' },
  { id: 'cat-personal', name: 'Personal', color: '#8b5cf6', iconName: 'User' },
  { id: 'cat-project', name: 'Projects', color: '#10b981', iconName: 'FolderGit2' },
  { id: 'cat-shopping', name: 'Shopping', color: '#f59e0b', iconName: 'ShoppingCart' },
  { id: 'cat-health', name: 'Health & Fitness', color: '#f43f5e', iconName: 'HeartPulse' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Welcome to TaskFlow! 🎉',
    description: 'Explore the features: check subtasks, filter by category or priority, toggle dark mode, or use keyboard shortcuts (press ?).',
    completed: false,
    priority: 'high',
    categoryId: 'cat-personal',
    dueDate: getTodayDateString(),
    dueTime: '17:00',
    createdAt: new Date().toISOString(),
    isPinned: true,
    tags: ['welcome', 'guide'],
    subtasks: [
      { id: 'sub-1', title: 'Check off this subtask to see the progress bar update', completed: true },
      { id: 'sub-2', title: 'Click the star icon to pin/unpin high-priority items', completed: false },
      { id: 'sub-3', title: 'Press "N" on your keyboard to create a new task', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Review quarterly project roadmap & deliverables',
    description: 'Align milestones with design and engineering leads before sprint planning.',
    completed: false,
    priority: 'urgent',
    categoryId: 'cat-work',
    dueDate: getTodayDateString(),
    dueTime: '15:30',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isPinned: true,
    tags: ['strategy', 'planning'],
    subtasks: [
      { id: 'sub-21', title: 'Compile feedback from stakeholders', completed: true },
      { id: 'sub-22', title: 'Finalize Q3 milestone deck', completed: false },
    ],
  },
  {
    id: 'task-3',
    title: 'Weekly grocery restock',
    description: 'Pick up fresh produce and essentials from farmer market.',
    completed: false,
    priority: 'medium',
    categoryId: 'cat-shopping',
    dueDate: getTomorrowDateString(),
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isPinned: false,
    tags: ['groceries'],
    subtasks: [
      { id: 'sub-31', title: 'Avocados & organic greens', completed: false },
      { id: 'sub-32', title: 'Almond milk & Greek yogurt', completed: false },
      { id: 'sub-33', title: 'Whole grain sourdough bread', completed: false },
    ],
  },
  {
    id: 'task-4',
    title: 'Morning 5km endurance run & core workout',
    description: 'Target pace: 5:15/km followed by 10 minutes stretching.',
    completed: true,
    completedAt: new Date().toISOString(),
    priority: 'medium',
    categoryId: 'cat-health',
    dueDate: getTodayDateString(),
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    isPinned: false,
    tags: ['fitness', 'routine'],
    subtasks: [
      { id: 'sub-41', title: 'Warm-up dynamic stretching', completed: true },
      { id: 'sub-42', title: '5km outdoor run', completed: true },
      { id: 'sub-43', title: 'Core circuit (planks, crunches)', completed: true },
    ],
  },
  {
    id: 'task-5',
    title: 'Design high-fidelity UI components in Figma',
    description: 'Complete mobile layouts and responsive state variants.',
    completed: false,
    priority: 'low',
    categoryId: 'cat-project',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    isPinned: false,
    tags: ['ui-ux', 'design'],
    subtasks: [],
  },
];

const TASKS_KEY = 'taskflow_tasks_v1';
const CATEGORIES_KEY = 'taskflow_categories_v1';

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) {
      saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse tasks from localStorage', err);
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse categories from localStorage', err);
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories to localStorage', err);
  }
}
