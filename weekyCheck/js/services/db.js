const TASKS_KEY = 'tasks';
const THEME_KEY = 'theme';

/**
 * Loads persisted tasks from localStorage.
 * Falls back to an empty list if data is missing or invalid.
 *
 * @returns {Array<Object>} Persisted task list.
 */
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

/**
 * Persists the task list into localStorage.
 *
 * @param {Array<Object>} tasks - Task list to persist.
 * @returns {void}
 */
export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks ?? []));
}

/**
 * Loads stored UI theme from localStorage.
 *
 * @returns {'dark'|'light'|null} Stored theme or null if not found/invalid.
 */
export function loadTheme() {
  const t = localStorage.getItem(THEME_KEY);
  return t === 'dark' || t === 'light' ? t : null;
}

/**
 * Saves selected UI theme in localStorage.
 *
 * @param {'dark'|'light'} theme - Theme to persist.
 * @returns {void}
 */
export function saveTheme(theme) {
  if (theme !== 'dark' && theme !== 'light') return;
  localStorage.setItem(THEME_KEY, theme);
}

