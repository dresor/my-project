import { describe, it, expect, beforeEach } from 'vitest';
import { loadTasks, saveTasks, INITIAL_TASKS, DEFAULT_CATEGORIES, loadCategories, saveCategories } from './storage';
import { Task } from '../types/todo';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads initial tasks when storage is empty', () => {
    const tasks = loadTasks();
    expect(tasks).toEqual(INITIAL_TASKS);
  });

  it('saves and reloads custom tasks correctly', () => {
    const customTask: Task = {
      id: 'task-test',
      title: 'Test Task',
      completed: false,
      priority: 'high',
      categoryId: 'cat-work',
      createdAt: new Date().toISOString(),
      subtasks: [],
      tags: ['test'],
      isPinned: false
    };

    saveTasks([customTask]);
    const loaded = loadTasks();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].title).toBe('Test Task');
  });

  it('loads default categories when empty', () => {
    const categories = loadCategories();
    expect(categories).toEqual(DEFAULT_CATEGORIES);
  });

  it('saves custom categories', () => {
    saveCategories([...DEFAULT_CATEGORIES, { id: 'cat-custom', name: 'Custom', color: '#123456' }]);
    const loaded = loadCategories();
    expect(loaded.some((c) => c.id === 'cat-custom')).toBe(true);
  });
});
