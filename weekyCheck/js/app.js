/**
 * WeekyCheck - Main Application Entry Point
 * Aplicación de gestión de tareas con separación de responsabilidades
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

// Controllers
import { TaskController } from './controllers/TaskController.js';

// Utils
import { validateNewTask } from './utils/validations.js';

/**
 * Main Application Class
 */
class WeekyCheckApp {
  constructor() {
    // Initialize services
    this.themeService = new ThemeService();
    
    // Initialize model with loaded tasks
    const savedTasks = StorageService.loadTasks();
    this.taskCollection = new TaskCollection(savedTasks);
    
    // Initialize controller
    this.taskController = new TaskController(
      this.taskCollection,
      () => this.render()
    );
    
    // Initialize components (without DOM refs yet)
    this.statsPanel = new StatsPanel();
    this.filterBar = new FilterBar();
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
  }

  /**
   * Get filtered tasks based on current filter state
   * @returns {Array}
   */
  getFilteredTasks() {
    return this.filterBar.createFilterFn()(this.taskCollection.getAll());
  }

  /**
   * Initialize the application
   */
  init() {
    // Initialize theme
    this.themeService.init();
    
    // Initialize filter bar
    this.filterBar.init();
    
    // Initialize stats panel
    this.statsPanel.init();
    
    // Initialize task list
    this.taskList.init();
    
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
    
    // Task list actions
    this.taskList.bindActions({
      edit: (id) => this.taskController.editTask(id),
      delete: (id) => this.taskController.deleteTask(id),
      toggle: (id) => this.taskController.toggleTask(id),
    });
    
    // New task form
    this.newTaskForm?.addEventListener('submit', (e) => this.handleNewTask(e));
    
    // Bulk actions
    this.btnMarkAllCompleted?.addEventListener('click', () => {
      this.taskController.markAllCompleted();
    });
    
    this.btnDeleteAllCompleted?.addEventListener('click', () => {
      this.taskController.deleteAllCompleted();
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
  handleNewTask(e) {
    e.preventDefault();
    
    const title = this.taskInput?.value;
    const priority = this.prioritySelect?.value;
    const type = this.typeSelect?.value;
    
    const success = this.taskController.addTask({ title, priority, type });
    
    if (success) {
      // Clear form
      if (this.taskInput) this.taskInput.value = '';
      this.render();
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
