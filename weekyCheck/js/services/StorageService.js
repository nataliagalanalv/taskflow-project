/**
 * StorageService - Maneja la persistencia en localStorage
 * (Refactorización de db.js con mejor separación de responsabilidades)
 */

const STORAGE_KEYS = {
  TASKS: 'tasks',
  THEME: 'theme',
};

export class StorageService {
  /**
   * Loads tasks from localStorage
   * @returns {Array} Array of task objects or empty array if none found
   */
  static loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
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
  static saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks ?? []));
  }

  /**
   * Loads the saved theme preference from localStorage
   * @returns {string|null} 'dark', 'light', or null if not set
   */
  static loadTheme() {
    const t = localStorage.getItem(STORAGE_KEYS.THEME);
    return t === 'dark' || t === 'light' ? t : null;
  }

  /**
   * Saves the theme preference to localStorage
   * @param {string} theme - Theme value ('dark' or 'light')
   * @returns {void}
   */
  static saveTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
}

// Export functions for backward compatibility
export const loadTasks = StorageService.loadTasks;
export const saveTasks = StorageService.saveTasks;
export const loadTheme = StorageService.loadTheme;
export const saveTheme = StorageService.saveTheme;