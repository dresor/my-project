import React, { useState } from 'react';
import { 
  Check, 
  Star, 
  Calendar, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronRight, 
  CheckSquare, 
  Square,
  AlertTriangle,
  Tag
} from 'lucide-react';
import { Task, Category, Priority } from '../types/todo';
import { formatDueDate, isOverdue, isToday } from '../utils/date';
import { soundManager } from '../utils/audio';

interface TaskItemProps {
  task: Task;
  category?: Category;
  isSelected: boolean;
  onSelect: (taskId: string, selected: boolean) => void;
  onToggleComplete: (taskId: string) => void;
  onTogglePin: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

const priorityBadgeStyles: Record<Priority, { bg: string; text: string; label: string }> = {
  urgent: { bg: 'bg-red-100 dark:bg-red-950/80 border-red-200 dark:border-red-900', text: 'text-red-700 dark:text-red-300', label: 'Urgent' },
  high: { bg: 'bg-orange-100 dark:bg-orange-950/80 border-orange-200 dark:border-orange-900', text: 'text-orange-700 dark:text-orange-300', label: 'High' },
  medium: { bg: 'bg-amber-100 dark:bg-amber-950/80 border-amber-200 dark:border-amber-900', text: 'text-amber-700 dark:text-amber-300', label: 'Medium' },
  low: { bg: 'bg-blue-100 dark:bg-blue-950/80 border-blue-200 dark:border-blue-900', text: 'text-blue-700 dark:text-blue-300', label: 'Low' },
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  category,
  isSelected,
  onSelect,
  onToggleComplete,
  onTogglePin,
  onEdit,
  onDelete,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const overdue = !task.completed && isOverdue(task.dueDate, task.dueTime);
  const todayDue = !task.completed && isToday(task.dueDate);

  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-75'
          : task.isPinned
          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/50 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow'
      }`}
    >
      <div className="p-4 sm:p-4.5 flex items-start gap-3.5">
        
        {/* Selection Checkbox (bulk actions) */}
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(task.id, e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            title="Select for bulk action"
          />
        </div>

        {/* Completion Round Checkbox */}
        <button
          type="button"
          onClick={() => {
            if (!task.completed) {
              soundManager.playComplete();
            } else {
              soundManager.playUncomplete();
            }
            onToggleComplete(task.id);
          }}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/20 scale-105'
              : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:scale-105 bg-white dark:bg-slate-900'
          }`}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {task.completed && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onEdit(task)}
              className={`text-base font-semibold tracking-tight cursor-pointer leading-snug transition-colors ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              {task.title}
            </h3>

            {/* Pin Button */}
            <button
              type="button"
              onClick={() => onTogglePin(task.id)}
              title={task.isPinned ? "Unpin task" : "Pin task to top"}
              className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                task.isPinned
                  ? 'text-amber-500 hover:text-amber-600 bg-amber-100/60 dark:bg-amber-950/50'
                  : 'text-slate-300 dark:text-slate-600 hover:text-amber-500 opacity-0 group-hover:opacity-100'
              }`}
            >
              <Star className={`w-4 h-4 ${task.isPinned ? 'fill-amber-500' : ''}`} />
            </button>
          </div>

          {/* Description */}
          {task.description && (
            <p className={`mt-1 text-sm leading-relaxed line-clamp-2 ${
              task.completed ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-600 dark:text-slate-400'
            }`}>
              {task.description}
            </p>
          )}

          {/* Badges / Metadata row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${
                priorityBadgeStyles[task.priority].bg
              } ${priorityBadgeStyles[task.priority].text}`}
            >
              {priorityBadgeStyles[task.priority].label}
            </span>

            {/* Category Badge */}
            {category && (
              <span 
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                <span>{category.name}</span>
              </span>
            )}

            {/* Due Date Badge */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
                  overdue
                    ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-semibold'
                    : todayDue
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {overdue ? <AlertTriangle className="w-3 h-3 text-red-500" /> : <Calendar className="w-3 h-3" />}
                <span>{formatDueDate(task.dueDate, task.dueTime)}</span>
              </span>
            )}

            {/* Subtask count & toggle button */}
            {totalSubtasks > 0 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <CheckSquare className="w-3 h-3 text-emerald-500" />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                ) : (
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                )}
              </button>
            )}

            {/* Tags */}
            {task.tags && task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800"
              >
                <Tag className="w-2.5 h-2.5 opacity-50" />
                {tag}
              </span>
            ))}

          </div>

          {/* Subtasks Progress Bar when items exist */}
          {totalSubtasks > 0 && (
            <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {/* Subtasks Expanded View */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Subtasks ({completedSubtasks}/{totalSubtasks})
              </div>

              {task.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm group/sub"
                >
                  <button
                    type="button"
                    onClick={() => onToggleSubtask(task.id, sub.id)}
                    className="flex items-center gap-2 text-left flex-1"
                  >
                    {sub.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className={`text-xs sm:text-sm ${sub.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                      {sub.title}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteSubtask(task.id, sub.id)}
                    className="opacity-0 group-hover/sub:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded transition-opacity"
                    title="Delete subtask"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add subtask inline input */}
              <form onSubmit={handleAddSubtask} className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!newSubtaskTitle.trim()}
                  className="px-2.5 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-50 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Add
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Action Buttons: Edit, Delete */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playDelete();
              onDelete(task.id);
            }}
            title="Delete task"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
