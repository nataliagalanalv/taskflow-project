/**
 * WeekyCheck - Main Application Entry Point
 * Aplicación de gestión de tareas con separación de responsabilidades
 * Migrado a API externa con manejo de estados de red
 */

// Models
import { TaskCollection } from './models/Task.js';

// Services
import { StorageService } from './services/StorageService.js';
import { ThemeService } from './services/ThemeService.js';

// Components
import { TaskList } from './components/TaskList.js';
import { StatsPanel } from './components/StatsPanel.js';
import { FilterBar } from './components/FilterBar.js';
import { Timer } from './components/Timer.js';
import { FocusMode } from './components/FocusMode.js';

// Controllers
import { TaskController } from './controllers/TaskController.js';

// API
import { taskAPI } from './api/client.js';

// Utils
import { validateNewTask } from './utils/validations.js';

// ==========================================
// SISTEMA DE TEMPORIZADOR POMODORO PROFESIONAL
// ==========================================

// Variables de estado global del temporizador
window.timeLeft = 1500; // 25 minutos en segundos
window.timerId = null;
window.isRunning = false;

// ==========================================
// SISTEMA DE SELECCIÓN DE TAREAS PARA MODO ENFOQUE
// ==========================================

// Variable global para la tarea seleccionada
window.selectedTaskId = null;

/**
 * Mostrar alerta psicodélica para indicar que debe seleccionar una tarea
 */
window.showSelectTaskAlert = function() {
  // Crear overlay de alerta
  const alert = document.createElement('div');
  alert.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm';
  alert.innerHTML = `
    <div class="relative p-12 rounded-3xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-[#00d2ff] animate-pulse">
      <div class="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-[#00d2ff] blur-xl opacity-50 animate-ping"></div>
      <div class="relative text-center">
        <div class="text-6xl mb-4">👆</div>
        <h2 class="text-3xl font-black text-white mb-2">¡Selecciona una Tarea!</h2>
        <p class="text-white/80">Haz click en una tarea para enfocarte en ella.</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(alert);
  
  // Eliminar después de 2 segundos
  setTimeout(() => {
    alert.remove();
  }, 2000);
};

/**
 * Seleccionar una tarea por su ID
 * Si ya está seleccionada, la deselecciona
 * @param {string} taskId - ID de la tarea a seleccionar (string format from API)
 */
window.selectTask = function(taskId) {
  // Si ya está seleccionada esta tarea, deseleccionarla
  if (window.selectedTaskId === taskId) {
    window.clearSelectedTask();
    return;
  }
  
  // Si ya había una tarea seleccionada, quitar el resaltado
  if (window.selectedTaskId !== null) {
    const prevTask = document.querySelector(`li[data-task-id="${window.selectedTaskId}"]`);
    if (prevTask) {
      prevTask.classList.remove('border-fuchsia-500', 'shadow-[0_0_15px_rgba(217,70,239,0.3)]');
      prevTask.style.border = '';
    }
  }
  
  // Establecer nueva tarea seleccionada
  window.selectedTaskId = taskId;
  
  // Añadir resaltado a la nueva tarea seleccionada
  if (taskId !== null) {
    const newTask = document.querySelector(`li[data-task-id="${taskId}"]`);
    if (newTask) {
      newTask.classList.add('border-fuchsia-500', 'shadow-[0_0_15px_rgba(217,70,239,0.3)]');
      newTask.style.borderColor = 'rgba(217, 70, 239, 0.8)';
    }
  }
};

/**
 * Limpiar la selección de tarea
 */
window.clearSelectedTask = function() {
  if (window.selectedTaskId !== null) {
    const prevTask = document.querySelector(`li[data-task-id="${window.selectedTaskId}"]`);
    if (prevTask) {
      prevTask.classList.remove('border-fuchsia-500', 'shadow-[0_0_15px_rgba(217,70,239,0.3)]');
      prevTask.style.border = '';
    }
  }
  window.selectedTaskId = null;
};

/**
 * Formatear tiempo en MM:SS
 * @param {number} seconds - Tiempo en segundos
 * @returns {string} Tiempo formateado
 */
window.formatTime = function(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Actualizar todos los displays del temporizador en el DOM
 * Actualiza elementos con clase .timer-display
 */
window.updateTimerDisplay = function() {
  const displays = document.querySelectorAll('.timer-display');
  const formattedTime = window.formatTime(window.timeLeft);
  
  displays.forEach(display => {
    display.textContent = formattedTime;
    
    // Añadir animate-pulse solo cuando está corriendo
    if (window.isRunning) {
      display.classList.add('animate-pulse');
    } else {
      display.classList.remove('animate-pulse');
    }
    
    // Cambiar color cuando está en pausa
    if (!window.isRunning && window.timeLeft !== 1500) {
      display.classList.add('text-slate-500');
      display.classList.remove('text-[#00d2ff]');
    } else {
      display.classList.remove('text-slate-500');
      display.classList.add('text-[#00d2ff]');
    }
  });
  
  // Actualizar texto de botones start
  const startBtns = document.querySelectorAll('.btn-start');
  startBtns.forEach(btn => {
    btn.textContent = window.isRunning ? 'Pausar' : 'Iniciar';
  });
};

/**
 * Iniciar el temporizador
 */
window.startTimer = function() {
  if (window.isRunning) return;
  
  window.isRunning = true;
  window.timerId = setInterval(() => {
    if (window.timeLeft > 0) {
      window.timeLeft--;
      window.updateTimerDisplay();
    } else {
      // Temporizador completado
      window.pauseTimer();
      // Alerta visual psicodélica
      window.showPsychedelicAlert();
      // Restablecer a 1500 segundos (25 minutos)
      window.timeLeft = 1500;
      window.updateTimerDisplay();
    }
  }, 1000);
  
  window.updateTimerDisplay();
};

/**
 * Pausar el temporizador
 */
window.pauseTimer = function() {
  if (!window.isRunning) return;
  
  window.isRunning = false;
  if (window.timerId) {
    clearInterval(window.timerId);
    window.timerId = null;
  }
  
  window.updateTimerDisplay();
};

/**
 * Reiniciar el temporizador a 25 minutos
 */
window.resetTimer = function() {
  window.pauseTimer();
  window.timeLeft = 1500;
  window.updateTimerDisplay();
};

/**
 * Mostrar alerta visual psicodélica cuando el temporizador llega a 0
 */
window.showPsychedelicAlert = function() {
  // Crear overlay de alerta
  const alert = document.createElement('div');
  alert.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm';
  alert.innerHTML = `
    <div class="relative p-12 rounded-3xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-[#00d2ff] animate-pulse">
      <div class="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-[#00d2ff] blur-xl opacity-50 animate-ping"></div>
      <div class="relative text-center">
        <div class="text-6xl mb-4">⏰</div>
        <h2 class="text-3xl font-black text-white mb-2">¡Tiempo Completado!</h2>
        <p class="text-white/80">El temporizador Pomodoro ha finalizado.</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(alert);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    alert.remove();
  }, 3000);
};

/**
 * Bind events para los botones del temporizador
 * Se ejecuta después de que la app esté inicializada
 */
function bindTimerEvents() {
  // Pequeño delay para asegurar que los elementos existen
  setTimeout(() => {
    // Botones de inicio/pausa (toggle)
    const startBtns = document.querySelectorAll('.btn-start');
    startBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        if (window.isRunning) {
          window.pauseTimer();
        } else {
          window.startTimer();
        }
      });
    });
    
    // Botones de reinicio
    const resetBtns = document.querySelectorAll('.btn-reset');
    resetBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        window.resetTimer();
      });
    });
  }, 200);
}

// Inicializar eventos del temporizador después de que la app esté lista
document.addEventListener('DOMContentLoaded', () => {
  // Esperar a que la app se inicialice
  setTimeout(() => {
    bindTimerEvents();
    window.updateTimerDisplay();
  }, 300);
});

// También ejecutar si el DOM ya está listo
if (document.readyState !== 'loading') {
  setTimeout(() => {
    bindTimerEvents();
    window.updateTimerDisplay();
  }, 300);
}

/**
 * Main Application Class
 */
class WeekyCheckApp {
  constructor() {
    // Initialize services
    this.themeService = new ThemeService();
    
    // Initialize empty collection (will be populated async)
    this.taskCollection = new TaskCollection([]);
    
    // Loading and error state
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    
    // Initialize controller with error handler
    this.taskController = new TaskController(
      this.taskCollection,
      () => this.render(),
      (message, error) => this.showError(message, error),
      (loading) => this.handleLoadingChange(loading)
    );
    
    // Initialize components (without DOM refs yet)
    this.statsPanel = new StatsPanel();
    this.filterBar = new FilterBar();
    this.timer = new Timer();
    this.focusMode = new FocusMode(this.taskCollection, this.taskController);
    this.taskList = new TaskList(
      this.taskCollection,
      () => this.getFilteredTasks()
    );
    // Establecer referencia cruzada para filtrado reactivo
    this.taskList.setFilterBar(this.filterBar);
    
    // DOM elements for form
    this.newTaskForm = document.getElementById('new-task-form');
    this.taskInput = document.getElementById('task');
    this.prioritySelect = document.getElementById('task-priority');
    this.typeSelect = document.getElementById('task-type');
    this.btnMarkAllCompleted = document.getElementById('mark-all-completed');
    this.btnDeleteAllCompleted = document.getElementById('delete-all-completed');
    this.btnExportBackup = document.getElementById('export-backup');
    
    // Setup API callbacks
    this.setupAPICallbacks();
  }

  /**
   * Setup API loading and error callbacks
   */
  setupAPICallbacks() {
    taskAPI.onLoadingChange = (loading) => {
      this.isLoading = loading;
      this.updateLoadingUI();
    };
    
    taskAPI.onError = (message, error) => {
      this.showError(message, error);
    };
  }

  /**
   * Show error message to user
   */
  showError(message, error) {
    this.hasError = true;
    this.errorMessage = message;
    this.updateErrorUI();
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  /**
   * Hide error message
   */
  hideError() {
    this.hasError = false;
    this.errorMessage = '';
    this.updateErrorUI();
  }

  /**
   * Update loading UI elements
   */
  updateLoadingUI() {
    const taskListContainer = document.getElementById('task-list');
    if (!taskListContainer) return;

    if (this.isLoading) {
      // Show loading spinner
      taskListContainer.innerHTML = `
        <li class="flex items-center justify-center p-12">
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <p class="text-slate-500 dark:text-slate-400 font-semibold">Cargando tareas...</p>
          </div>
        </li>
      `;
    }
  }

    /**
 * Gestiona el estado visual de carga de toda la aplicación
 * @param {boolean} isLoading - Si la app está realizando una operación de red
 */
  handleLoadingChange(isLoading) {
    this.isLoading = isLoading;
    
    // Gestionar el cursor del ratón
    document.body.style.cursor = isLoading ? 'wait' : 'default';

    // Gestionar el spinner de la lista
    this.updateLoadingUI();

    // Bloquear el botón de envío para evitar duplicados
    const submitBtn = this.newTaskForm?.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = isLoading;
        submitBtn.opacity = isLoading ? '0.5' : '1';
    }
  }

  /**
   * Update error UI elements
   */
  updateErrorUI() {
    // Remove existing error banner
    const existingBanner = document.getElementById('api-error-banner');
    if (existingBanner) {
      existingBanner.remove();
    }

    if (this.hasError) {
      // Create error banner
      const banner = document.createElement('div');
      banner.id = 'api-error-banner';
      banner.className = 'fixed top-4 right-4 z-[200] bg-red-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3';
      banner.innerHTML = `
        <span class="text-xl">⚠️</span>
        <div>
          <p class="font-bold">Error de conexión</p>
          <p class="text-sm opacity-90">${this.errorMessage}</p>
        </div>
        <button onclick="document.getElementById('api-error-banner').remove()" class="ml-4 text-white hover:text-red-200 text-xl">✕</button>
      `;
      document.body.appendChild(banner);
    }
  }

  /**
   * Get filtered tasks based on current filter state
   * @returns {Array}
   */
  getFilteredTasks() {
    return this.filterBar.createFilterFn()(this.taskCollection.getAll());
  }

  /**
   * Initialize the application (async)
   */
  async init() {
    // Initialize theme
    this.themeService.init();
    
    // Initialize filter bar
    this.filterBar.init();
    
    // Initialize stats panel
    this.statsPanel.init();
    
    // Initialize timer (independent of task operations)
    this.timer.init();
    
    // Initialize focus mode
    this.focusMode.init();
    
    // Initialize task list
    this.taskList.init();
    
    // Load tasks from API
    try {
      const tasks = await StorageService.loadTasks();
      this.taskCollection = new TaskCollection(tasks);
      
      // Reinitialize controller with the new collection
      this.taskController = new TaskController(
        this.taskCollection,
        () => this.render(),
        (message, error) => this.showError(message, error),
        (loading) => this.handleLoadingChange(loading) // <--- AÑADE ESTA LÍNEA AQUÍ
      );

      // Update focus mode reference
      this.focusMode.setTaskCollection(this.taskCollection);
      this.focusMode.setTaskController(this.taskController);
      
      // Update task list reference
      this.taskList.taskCollection = this.taskCollection;
      
      this.hasError = false;
      this.errorMessage = '';
    } catch (error) {
      console.error('WeekyCheckApp: Error loading tasks:', error);
      this.showError('No se pudo conectar con el servidor', error.message);
      this.hasError = true;
    }
    
    // Bind events
    this.bindEvents();
    
    // Initial render
    this.render();
  }

  /**
   * Bind all event handlers
   */
  bindEvents() {
    // Theme toggle
    this.themeService.bindToggleEvent(() => this.render());
    
    // Task list actions (now async)
    this.taskList.bindActions({
      edit: async (id) => {
        await this.taskController.editTask(id);
      },
      delete: async (id) => {
        await this.taskController.deleteTask(id);
      },
      toggle: async (id) => {
        await this.taskController.toggleTask(id);
      },
    });
    
    // New task form
    this.newTaskForm?.addEventListener('submit', (e) => this.handleNewTask(e));
    
    // Bulk actions (now async)
    this.btnMarkAllCompleted?.addEventListener('click', async () => {
      await this.taskController.markAllCompleted();
    });
    
    this.btnDeleteAllCompleted?.addEventListener('click', async () => {
      await this.taskController.deleteAllCompleted();
    });
    
    // Export backup
    this.btnExportBackup?.addEventListener('click', () => {
      this.exportBackup();
    });
    
    // Filter events - Bind traditional callbacks
    this.filterBar.bindEvents(
      () => this.render(), // onFilterChange
      () => this.render()  // onSearchChange
    );
    
    // Reactive filter events - TaskList escucha eventos personalizados
    this.taskList.bindFilterEvents(() => this.render());
  }

  /**
   * Handle new task form submission
   * @param {Event} e - Submit event
   */
  async handleNewTask(e) {
    e.preventDefault();
    
    const title = this.taskInput?.value;
    const priority = this.prioritySelect?.value;
    const type = this.typeSelect?.value;
    
    const success = await this.taskController.addTask({ title, priority, type });
    
    if (success) {
      // Clear form
      if (this.taskInput) this.taskInput.value = '';
    }
    // No need to call render() - controller already triggers it
  }

  /**
   * Export tasks to a JSON backup file
   */
  exportBackup() {
    try {
      // Get current tasks from the collection
      const tasks = this.taskCollection.getAll();
      
      // Create backup data object
      const backupData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        tasks: tasks
      };
      
      // Convert to JSON string with pretty formatting
      const jsonString = JSON.stringify(backupData, null, 2);
      
      // Create blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Generate filename with current date
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const filename = `weekycheck-backup-${year}${month}${day}-${hours}${minutes}.json`;
      
      // Configure and trigger download
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log(`Backup exported: ${filename} (${tasks.length} tasks)`);
      
    } catch (error) {
      console.error('Error exporting backup:', error);
    }
  }

  /**
   * Render all UI components
   */
  render() {
    // Update task list
    this.taskList.render();
    
    // Update statistics
    this.statsPanel.update(this.taskCollection.stats);
  }
}

// Initialize application
const app = new WeekyCheckApp();
app.init();

// Bind timer events after app initialization
setTimeout(() => {
  bindTimerEvents();
  window.updateTimerDisplay();
}, 500);
