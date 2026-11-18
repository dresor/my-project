export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  categoryId: string;
  dueDate?: string; // YYYY-MM-DD format
  dueTime?: string; // HH:mm format
  createdAt: string; // ISO string
  completedAt?: string | null;
  subtasks: Subtask[];
  isPinned: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string; // Hex color or CSS color
  iconName?: string;
}

export type ViewFilter = 'all' | 'today' | 'upcoming' | 'overdue' | 'completed';

export type SortField = 'dueDate' | 'priority' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  view: ViewFilter;
  categoryId: string | null;
  priority: Priority | 'all';
  searchQuery: string;
  selectedTag: string | null;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  overdueTasks: number;
  completionRate: number;
  streakDays: number;
}
