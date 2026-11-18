export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr: string, timeStr?: string): Date {
  if (timeStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  // Default to end of day if no time specified
  return new Date(year, month - 1, day, 23, 59, 59, 999);
}

export function isOverdue(dateStr?: string, timeStr?: string): boolean {
  if (!dateStr) return false;
  const dueDate = parseDate(dateStr, timeStr);
  return dueDate < new Date();
}

export function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr === getTodayDateString();
}

export function isTomorrow(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr === getTomorrowDateString();
}

export function formatDueDate(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return '';
  
  if (isToday(dateStr)) {
    return timeStr ? `Today at ${formatTime(timeStr)}` : 'Today';
  }
  if (isTomorrow(dateStr)) {
    return timeStr ? `Tomorrow at ${formatTime(timeStr)}` : 'Tomorrow';
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const formatted = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });

  return timeStr ? `${formatted}, ${formatTime(timeStr)}` : formatted;
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}
