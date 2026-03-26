const TASKS_KEY = 'tasks';
const THEME_KEY = 'theme';

/**
 * Loads tasks from localStorage
 * @returns {Array} Array of task objects or empty array if none found
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
 * Saves tasks array to localStorage
 * @param {Array} tasks - Array of task objects to save
 * @returns {void}
 */
export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks ?? []));
}

/**
 * Loads the saved theme preference from localStorage
 * @returns {string|null} 'dark', 'light', or null if not set
 */
export function loadTheme() {
  const t = localStorage.getItem(THEME_KEY);
  return t === 'dark' || t === 'light' ? t : null;
}

/**
 * Saves the theme preference to localStorage
 * @param {string} theme - Theme value ('dark' or 'light')
 * @returns {void}
 */
export function saveTheme(theme) {
  if (theme !== 'dark' && theme !== 'light') return;
  localStorage.setItem(THEME_KEY, theme);
}

