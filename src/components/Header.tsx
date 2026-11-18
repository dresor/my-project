import React from 'react';
import { 
  CheckCircle2, 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  BarChart2, 
  HelpCircle, 
  Menu,
  X
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNewTaskModal: () => void;
  onOpenStatsModal: () => void;
  onOpenShortcutsModal: () => void;
  isMobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleTheme,
  isSoundEnabled,
  onToggleSound,
  onOpenNewTaskModal,
  onOpenStatsModal,
  onOpenShortcutsModal,
  isMobileSidebarOpen,
  onToggleMobileSidebar,
  searchInputRef,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Left */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-md shadow-green-500/20 text-white">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tasks, notes, tags... (Press /)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-1.5 text-sm bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-emerald-500 rounded-xl placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            title={isSoundEnabled ? "Mute sound effects (M)" : "Enable sound effects (M)"}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 opacity-60" />}
          </button>

          {/* Productivity Stats */}
          <button
            type="button"
            onClick={onOpenStatsModal}
            title="Productivity Statistics"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={isDarkMode ? "Switch to Light Mode (D)" : "Switch to Dark Mode (D)"}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Shortcuts Info */}
          <button
            type="button"
            onClick={onOpenShortcutsModal}
            title="Keyboard shortcuts (?)"
            className="hidden md:flex p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* New Task CTA */}
          <button
            type="button"
            onClick={() => {
              soundManager.playAdd();
              onOpenNewTaskModal();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium text-sm shadow-md shadow-emerald-600/25 transition-all hover:shadow-lg hover:shadow-emerald-600/30"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>

      </div>

      {/* Mobile search bar visible on small screens */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>
    </header>
  );
};
