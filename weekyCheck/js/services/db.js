const TASKS_KEY = 'tasks';
const THEME_KEY = 'theme';

export function loadTasks() {
  try {
    const saved = localStorage.getItem(TASKS_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks ?? []));
}

export function loadTheme() {
  const t = localStorage.getItem(THEME_KEY);
  return t === 'dark' || t === 'light' ? t : null;
}

export function saveTheme(theme) {
  if (theme !== 'dark' && theme !== 'light') return;
  localStorage.setItem(THEME_KEY, theme);
}

