/**
 * TaskList - Componente para gestionar la lista de tareas
 * Escucha eventos personalizados de FilterBar para filtrar reactivamente
 */

import { TaskItemRenderer } from './TaskItem.js';
import { FILTER_EVENTS } from './FilterBar.js';

export class TaskList {
  constructor(taskCollection, filterFn) {
    this.taskCollection = taskCollection;
    this.filterFn = filterFn;
    this.container = null;
    this.template = null;
    this.renderer = null;
    // Referencia externa a FilterBar para obtener la función de filtro actualizada
    this.filterBar = null;
  }

  /**
   * Establecer referencia al FilterBar para escucha reactiva
   * @param {Object} filterBar - Instancia de FilterBar
   */
  setFilterBar(filterBar) {
    this.filterBar = filterBar;
  }

  /**
   * Initialize DOM references and renderer
   */
  init() {
    this.container = document.getElementById('task-list');
    this.template = document.getElementById('template-task');
    this.renderer = new TaskItemRenderer(this.template);
  }

  /**
   * Bind to custom filter events for reactive filtering
   * Escucha eventos personalizados emitidos por FilterBar
   * @param {Function} onFilterTrigger - Callback para disparar el re-renderizado
   */
  bindFilterEvents(onFilterTrigger) {
    // Escuchar evento de cambio de prioridad
    document.addEventListener(FILTER_EVENTS.PRIORITY_CHANGE, () => {
      onFilterTrigger && onFilterTrigger();
    });

    // Escuchar evento de cambio de tipo
    document.addEventListener(FILTER_EVENTS.TYPE_CHANGE, () => {
      onFilterTrigger && onFilterTrigger();
    });

    // Escuchar evento de cambio de estado
    document.addEventListener(FILTER_EVENTS.STATUS_CHANGE, () => {
      onFilterTrigger && onFilterTrigger();
    });

    // Escuchar evento de cambio de búsqueda
    document.addEventListener(FILTER_EVENTS.SEARCH_CHANGE, () => {
      onFilterTrigger && onFilterTrigger();
    });

    // Escuchar evento genérico de filtro (para cualquier otro cambio)
    document.addEventListener(FILTER_EVENTS.FILTER_CHANGE, () => {
      onFilterTrigger && onFilterTrigger();
    });
  }

  /**
   * Render all filtered tasks
   */
  render() {
    if (!this.container || !this.renderer) return;

    this.container.innerHTML = '';
    const tasks = this.taskCollection.getAll();
    // Si tenemos filterBar, usamos su función de filtro actualizada
    const filteredTasks = this.filterBar 
      ? this.filterBar.createFilterFn()(tasks)
      : (this.filterFn ? this.filterFn(tasks) : tasks);

    filteredTasks.forEach(task => {
      this.container.appendChild(this.renderer.render(task));
    });
  }

  /**
   * Bind click events for task actions (edit, delete, complete)
   * @param {Object} handlers - Object with edit, delete, toggle callback functions
   */
  bindActions(handlers) {
    if (!this.container) return;

    this.container.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const actionButton = target.closest('.edit-task-btn, .delete-task-btn, .complete-task-btn');
      if (!actionButton) return;

      const taskItem = actionButton.closest('li[data-task-id]');
      if (!taskItem) return;

      const taskId = Number(taskItem.dataset.taskId);
      if (Number.isNaN(taskId)) return;

      if (actionButton.classList.contains('edit-task-btn')) {
        handlers.edit && handlers.edit(taskId);
        return;
      }
      if (actionButton.classList.contains('delete-task-btn')) {
        handlers.delete && handlers.delete(taskId);
        return;
      }
      if (actionButton.classList.contains('complete-task-btn')) {
        handlers.toggle && handlers.toggle(taskId);
      }
    });
  }
}