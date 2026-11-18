import React from 'react';
import { 
  Inbox, 
  Calendar, 
  CalendarDays, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Briefcase, 
  User, 
  FolderGit2, 
  ShoppingCart, 
  HeartPulse, 
  Folder,
  Tag,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';
import { Category, Priority, ViewFilter } from '../types/todo';

interface SidebarProps {
  currentView: ViewFilter;
  onSelectView: (view: ViewFilter) => void;
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  selectedPriority: Priority | 'all';
  onSelectPriority: (priority: Priority | 'all') => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  categories: Category[];
  onOpenAddCategoryModal: () => void;
  counts: {
    all: number;
    today: number;
    upcoming: number;
    overdue: number;
    completed: number;
    byCategory: Record<string, number>;
  };
  tags: string[];
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

const CategoryIcon: React.FC<{ iconName?: string; color: string; className?: string }> = ({ iconName, color, className = "w-4 h-4" }) => {
  switch (iconName) {
    case 'Briefcase': return <Briefcase className={className} style={{ color }} />;
    case 'User': return <User className={className} style={{ color }} />;
    case 'FolderGit2': return <FolderGit2 className={className} style={{ color }} />;
    case 'ShoppingCart': return <ShoppingCart className={className} style={{ color }} />;
    case 'HeartPulse': return <HeartPulse className={className} style={{ color }} />;
    default: return <Folder className={className} style={{ color }} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  selectedCategoryId,
  onSelectCategory,
  selectedPriority,
  onSelectPriority,
  selectedTag,
  onSelectTag,
  categories,
  onOpenAddCategoryModal,
  counts,
  tags,
  onExportData,
  onImportData,
  onResetData,
  isOpenOnMobile,
  onCloseMobile,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const viewItems = [
    { id: 'all' as ViewFilter, label: 'All Tasks', icon: Inbox, count: counts.all },
    { id: 'today' as ViewFilter, label: 'Today', icon: Calendar, count: counts.today },
    { id: 'upcoming' as ViewFilter, label: 'Upcoming', icon: CalendarDays, count: counts.upcoming },
    { id: 'overdue' as ViewFilter, label: 'Overdue', icon: AlertCircle, count: counts.overdue, isAlert: counts.overdue > 0 },
    { id: 'completed' as ViewFilter, label: 'Completed', icon: CheckCircle2, count: counts.completed },
  ];

  const priorities: Array<{ id: Priority | 'all'; label: string; dotColor: string }> = [
    { id: 'all', label: 'All', dotColor: 'bg-slate-400' },
    { id: 'urgent', label: 'Urgent', dotColor: 'bg-red-500' },
    { id: 'high', label: 'High', dotColor: 'bg-orange-500' },
    { id: 'medium', label: 'Medium', dotColor: 'bg-amber-400' },
    { id: 'low', label: 'Low', dotColor: 'bg-blue-400' },
  ];

  const handleSelectView = (v: ViewFilter) => {
    onSelectView(v);
    onSelectCategory(null);
    onCloseMobile();
  };

  const handleSelectCategory = (catId: string | null) => {
    onSelectCategory(catId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed md:sticky top-16 z-40 md:z-0
        w-72 h-[calc(100vh-4rem)] overflow-y-auto
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        p-4 flex flex-col justify-between transition-all duration-300
        ${isOpenOnMobile ? 'left-0 shadow-2xl' : '-left-72 md:left-0'}
      `}>
        <div className="space-y-6">
          
          {/* Main Navigation Views */}
          <div>
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
              Views
            </div>
            <nav className="space-y-1">
              {viewItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id && selectedCategoryId === null;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${item.isAlert ? 'text-red-500' : isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.isAlert
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : isActive
                          ? 'bg-emerald-200/60 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Priority Filter */}
          <div>
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
              Priority Filter
            </div>
            <div className="flex flex-wrap gap-1 px-1">
              {priorities.map((p) => {
                const isSelected = selectedPriority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPriority(p.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${p.dotColor}`} />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Categories
              </span>
              <button
                type="button"
                onClick={onOpenAddCategoryModal}
                title="Add new category"
                className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <nav className="space-y-1">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                const count = counts.byCategory[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-sm transition-all ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <CategoryIcon iconName={cat.iconName} color={cat.color} />
                      <span className="truncate">{cat.name}</span>
                    </div>
                    {count > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Tags
                </span>
                {selectedTag && (
                  <button
                    type="button"
                    onClick={() => onSelectTag(null)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 px-3">
                {tags.map((t) => {
                  const isSelected = selectedTag === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onSelectTag(isSelected ? null : t)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Tag className="w-3 h-3 opacity-60" />
                      #{t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Actions: Backup / Restore / Reset */}
        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={onImportData}
          />

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
            <span>Storage & Backup</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={onExportData}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
              title="Export all tasks and categories to JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
              title="Import tasks from a JSON file"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Import</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onResetData}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
            title="Reset sample tasks"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>

      </aside>
    </>
  );
};
