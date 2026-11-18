import { describe, it, expect } from 'vitest';
import { 
  getTodayDateString, 
  getTomorrowDateString, 
  isToday, 
  isTomorrow, 
  isOverdue, 
  formatDueDate 
} from './date';

describe('Date Utilities', () => {
  it('identifies today correctly', () => {
    const today = getTodayDateString();
    expect(isToday(today)).toBe(true);
    expect(isToday('2000-01-01')).toBe(false);
  });

  it('identifies tomorrow correctly', () => {
    const tomorrow = getTomorrowDateString();
    expect(isTomorrow(tomorrow)).toBe(true);
    expect(isTomorrow('2000-01-01')).toBe(false);
  });

  it('correctly calculates overdue status', () => {
    // Past date is overdue
    expect(isOverdue('2020-01-01')).toBe(true);
    // Far future date is not overdue
    expect(isOverdue('2099-12-31')).toBe(false);
  });

  it('formats dates nicely with friendly labels', () => {
    const today = getTodayDateString();
    expect(formatDueDate(today)).toBe('Today');

    const tomorrow = getTomorrowDateString();
    expect(formatDueDate(tomorrow)).toBe('Tomorrow');
  });
});
