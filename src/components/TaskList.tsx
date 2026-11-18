import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Trash2, 
  Plus, 
  Sparkles, 
  Filter, 
  CheckCheck
} from 'lucide-react';
import { Task, Category, Priority, SortField, SortOrder, ViewFilter } from '../types/todo';
import { TaskItem } from './TaskItem';
import { soundManager } from '../utils/audio';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  currentView: ViewFilter;
  selectedCategory: Category | null;
  selectedPriority: Priority | 'all';
  selectedTag: string | null;
  searchQuery: string;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void;
  selectedTaskIds: string[];
  onSelectTask: (taskId: string, selected: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onQuickAdd: (title: string) => void;
  onToggleComplete: (taskId: string) => void;
  onTogglePin: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onOpenNewTaskModal: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  categories,
  currentView,
  selectedCategory,
  selectedPriority,
  selectedTag,
  searchQuery,
  sortBy,
  sortOrder,
  onSortChange,
  selectedTaskIds,
  onSelectTask,
  onSelectAll,
  onDeselectAll,
  onBulkComplete,
  onBulkDelete,
  onQuickAdd,
  onToggleComplete,
  onTogglePin,
  onEdit,
  onDelete,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
  onOpenNewTaskModal,
}) => {
  const [quickTitle, setQuickTitle] = useState('');

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onQuickAdd(quickTitle.trim());
    setQuickTitle('');
    soundManager.playAdd();
  };

  const getViewTitle = () => {
    if (searchQuery) return `Search: "${searchQuery}"`;
    if (selectedCategory) return selectedCategory.name;
    switch (currentView) {
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming';
      case 'overdue': return 'Overdue Tasks';
      case 'completed': return 'Completed Tasks';
      default: return 'All Tasks';
    }
  };

  const getViewSubtitle = () => {
    const pendingCount = tasks.filter((t) => !t.completed).length;
    if (searchQuery) return `${tasks.length} result${tasks.length === 1 ? '' : 's'} found`;
    if (tasks.length === 0) return 'No tasks yet';
    return `${pendingCount} active ${pendingCount === 1 ? 'task' : 'tasks'}, ${tasks.length - pendingCount} completed`;
  };

  // Separate pinned vs standard
  const pinnedTasks = tasks.filter((t) => t.isPinned && !t.completed);
  const unpinnedTasks = tasks.filter((t) => !t.isPinned || t.completed);

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {getViewTitle()}
            </h1>
            {selectedCategory && (
              <span 
                className="w-3.5 h-3.5 rounded-full shadow-sm"
                style={{ backgroundColor: selectedCategory.color }} 
              />
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {getViewSubtitle()}
            </p>
            {selectedPriority !== 'all' && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                Priority: {selectedPriority}
              </span>
            )}
            {selectedTag && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                #{selectedTag}
              </span>
            )}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortField, sortOrder)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title (A-Z)</option>
          </select>

          <button
            type="button"
            onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleQuickSubmit} className="relative">
        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all p-1.5 pl-4">
          <input
            type="text"
            placeholder="Quick add: Type task title and press Enter..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="submit"
              disabled={!quickTitle.trim()}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm flex items-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </form>

      {/* Bulk Action Bar (when tasks are selected) */}
      {selectedTaskIds.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-sm animate-scale-in">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300">
              {selectedTaskIds.length} {selectedTaskIds.length === 1 ? 'task' : 'tasks'} selected
            </span>
            <button
              type="button"
              onClick={selectedTaskIds.length === tasks.length ? onDeselectAll : onSelectAll}
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline ml-2"
            >
              {selectedTaskIds.length === tasks.length ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBulkComplete}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Done</span>
            </button>
            <button
              type="button"
              onClick={onBulkDelete}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Task List Items */}
      {tasks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            {searchQuery ? <Filter className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {searchQuery ? 'No matching tasks found' : 'All caught up!'}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `We couldn't find any tasks matching "${searchQuery}". Try a different keyword.`
              : 'You have no pending tasks in this view. Enjoy your free time or add a new task!'}
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={onOpenNewTaskModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm shadow-md shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create a task</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          
          {/* Pinned Tasks Section */}
          {pinnedTasks.length > 0 && (
            <div className="space-y-2.5 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider px-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pinned Tasks</span>
              </div>
              {pinnedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  category={categoryMap.get(task.categoryId)}
                  isSelected={selectedTaskIds.includes(task.id)}
                  onSelect={onSelectTask}
                  onToggleComplete={onToggleComplete}
                  onTogglePin={onTogglePin}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleSubtask={onToggleSubtask}
                  onAddSubtask={onAddSubtask}
                  onDeleteSubtask={onDeleteSubtask}
                />
              ))}
            </div>
          )}

          {/* Standard / Other Tasks */}
          {unpinnedTasks.length > 0 && (
            <div className="space-y-2.5">
              {pinnedTasks.length > 0 && (
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 pt-2">
                  Other Tasks
                </div>
              )}
              {unpinnedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  category={categoryMap.get(task.categoryId)}
                  isSelected={selectedTaskIds.includes(task.id)}
                  onSelect={onSelectTask}
                  onToggleComplete={onToggleComplete}
                  onTogglePin={onTogglePin}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleSubtask={onToggleSubtask}
                  onAddSubtask={onAddSubtask}
                  onDeleteSubtask={onDeleteSubtask}
                />
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
