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
   * Alterna entre los temas claro y oscuro, persistiendo la preferencia en LocalStorage.
   * 
   * Esta función verifica el estado actual del tema y aplica el tema opuesto:
   * - Si el tema actual es oscuro → aplica tema claro
   * - Si el tema actual es claro → aplica tema oscuro
   * 
   * La preferencia del usuario se guarda automáticamente en LocalStorage para que
   * persista entre sesiones y recargas de página.
   * 
   * @function toggleDarkMode
   * @returns {void}
   * 
   * @example
   * // Alternar tema
   * themeService.toggle();
   * // Si estaba en modo oscuro → cambia a claro y guarda 'light' en LocalStorage
   * // Si estaba en modo claro → cambia a oscuro y guarda 'dark' en LocalStorage
   */
  toggle() {
    if (this.htmlElement.classList.contains('dark')) {
      this.applyLightTheme();
    } else {
      this.applyDarkTheme();
    }
  }

  /**
   * Aplica el tema oscuro y persiste la preferencia en LocalStorage.
   * 
   * Esta función:
   * 1. Añade la clase 'dark' al elemento raíz HTML
   * 2. Actualiza el estado interno del servicio
   * 3. Guarda la preferencia 'dark' en LocalStorage usando StorageService
   * 4. Actualiza el botón del toggle con el emoji ☀️ (para indicar que puede cambiar a claro)
   * 
   * @function applyDarkTheme
   * @returns {void}
   * 
   * @example
   * // Aplicar tema oscuro
   * themeService.applyDarkTheme();
   * // Resultado: HTML tiene clase 'dark', LocalStorage guarda 'dark', botón muestra ☀️
   */
  applyDarkTheme() {
    this.htmlElement.classList.add('dark');
    this.currentTheme = 'dark';
    StorageService.saveTheme('dark');
    this.updateToggleButton('☀️');
  }

  /**
   * Aplica el tema claro y persiste la preferencia en LocalStorage.
   * 
   * Esta función:
   * 1. Elimina la clase 'dark' del elemento raíz HTML
   * 2. Actualiza el estado interno del servicio
   * 3. Guarda la preferencia 'light' en LocalStorage usando StorageService
   * 4. Actualiza el botón del toggle con el emoji 🌙 (para indicar que puede cambiar a oscuro)
   * 
   * @function applyLightTheme
   * @returns {void}
   * 
   * @example
   * // Aplicar tema claro
   * themeService.applyLightTheme();
   * // Resultado: HTML no tiene clase 'dark', LocalStorage guarda 'light', botón muestra 🌙
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