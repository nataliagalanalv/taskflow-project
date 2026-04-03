/**
 * ThemeService - Maneja la lógica del tema (claro/oscuro)
 */

import { StorageService } from './StorageService.js';

export class ThemeService {
  constructor() {
    this.htmlElement = document.documentElement;
    this.toggleButton = null;
    this.currentTheme = 'light';
  }

  /**
   * Initialize DOM references after DOM is ready
   */
  initDOMReferences() {
    this.toggleButton = document.getElementById('toggle-dark');
  }

  /**
   * Initialize theme from saved preference
   */
  init() {
    this.initDOMReferences();
    const savedTheme = StorageService.loadTheme();
    if (savedTheme === 'dark') {
      this.applyDarkTheme();
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggle() {
    if (this.htmlElement.classList.contains('dark')) {
      this.applyLightTheme();
    } else {
      this.applyDarkTheme();
    }
  }

  /**
   * Apply dark theme
   */
  applyDarkTheme() {
    this.htmlElement.classList.add('dark');
    this.currentTheme = 'dark';
    StorageService.saveTheme('dark');
    this.updateToggleButton('☀️');
  }

  /**
   * Apply light theme
   */
  applyLightTheme() {
    this.htmlElement.classList.remove('dark');
    this.currentTheme = 'light';
    StorageService.saveTheme('light');
    this.updateToggleButton('🌙');
  }

  /**
   * Update the toggle button text
   * @param {string} emoji - The emoji to display
   */
  updateToggleButton(emoji) {
    if (this.toggleButton) {
      this.toggleButton.innerText = emoji;
    }
  }

  /**
   * Check if dark theme is active
   * @returns {boolean}
   */
  isDarkMode() {
    return this.htmlElement.classList.contains('dark');
  }

  /**
   * Bind toggle button click event
   * @param {Function} callback - Optional callback when theme changes
   */
  bindToggleEvent(callback) {
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => {
        this.toggle();
        if (callback) callback();
      });
    }
  }
}