import React from 'react';
import { 
  X, 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, Category } from '../types/todo';
import { isOverdue, isToday } from '../utils/date';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  categories: Category[];
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  tasks,
  categories,
}) => {
  if (!isOpen) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter((t) => !t.completed && isOverdue(t.dueDate, t.dueTime)).length;
  const completedToday = tasks.filter(
    (t) => t.completed && t.completedAt && isToday(t.completedAt.split('T')[0])
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority breakdown
  const urgentCount = tasks.filter((t) => t.priority === 'urgent' && !t.completed).length;
  const highCount = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
  const mediumCount = tasks.filter((t) => t.priority === 'medium' && !t.completed).length;
  const lowCount = tasks.filter((t) => t.priority === 'low' && !t.completed).length;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" />
            <span>Productivity Dashboard</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Progress Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-100">
                  Overall Completion
                </span>
                <div className="text-4xl font-extrabold mt-1">
                  {completionRate}%
                </div>
                <p className="text-xs text-emerald-100 mt-1">
                  {completedTasks} of {totalTasks} tasks finished
                </p>
              </div>

              <button
                type="button"
                onClick={triggerConfetti}
                className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl transition-transform active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
                title="Celebrate progress!"
              >
                <Sparkles className="w-4 h-4" />
                <span>Celebrate</span>
              </button>
            </div>

            {/* Background decorative circle */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{pendingTasks}</div>
              <div className="text-[11px] text-slate-500 font-medium">Active</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{completedToday}</div>
              <div className="text-[11px] text-slate-500 font-medium">Done Today</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <AlertTriangle className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-red-600 dark:text-red-400">{overdueTasks}</div>
              <div className="text-[11px] text-slate-500 font-medium">Overdue</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <div className="text-xl font-bold text-amber-500">{completedToday > 0 ? 1 : 0}</div>
              <div className="text-[11px] text-slate-500 font-medium">Day Streak</div>
            </div>
          </div>

          {/* Priority Distribution */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Pending Tasks by Priority
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Urgent
                </span>
                <span className="font-bold">{urgentCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> High
                </span>
                <span className="font-bold">{highCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Medium
                </span>
                <span className="font-bold">{mediumCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-400" /> Low
                </span>
                <span className="font-bold">{lowCount}</span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => {
                const catTasks = tasks.filter((t) => t.categoryId === cat.id);
                const catDone = catTasks.filter((t) => t.completed).length;
                const catPct = catTasks.length > 0 ? Math.round((catDone / catTasks.length) * 100) : 0;
                return (
                  <div key={cat.id} className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </span>
                      <span className="text-slate-400">
                        {catDone}/{catTasks.length} ({catPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${catPct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
