/**
 * TaskList - Componente para gestionar la lista de tareas
 * Escucha eventos personalizados de FilterBar para filtrar reactivamente
 */

import { TaskItemRenderer } from './TaskItem.js';
import { FILTER_EVENTS, PRIORITY_WEIGHTS } from './FilterBar.js';

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

    // Escuchar evento de cambio de ordenación
    document.addEventListener(FILTER_EVENTS.SORT_CHANGE, () => {
      onFilterTrigger && onFilterTrigger();
    });

    // Escuchar evento genérico de filtro (para cualquier otro cambio)
    document.addEventListener(FILTER_EVENTS.FILTER_CHANGE, () => {
      onFilterTrigger && onFilterTrigger();
    });
  }

  /**
   * Función de ordenación de tareas
   * @param {Array} tasksArray - Array de tareas a ordenar
   * @returns {Array} - Array de tareas ordenadas
   */
  sortTasks(tasksArray) {
    const sortType = this.filterBar ? this.filterBar.getSortFilter() : 'recent';
    
    // Crear una copia para no mutar el array original
    const sortedTasks = [...tasksArray];
    
    switch (sortType) {
      case 'recent':
        // Ordenar por más recientes (asumimos que el array ya viene en orden de creación)
        // Si las tareas tienen un timestamp, ordenar por él; si no, mantener orden actual
        sortedTasks.sort((a, b) => {
          const timeA = a.createdAt || a.id || 0;
          const timeB = b.createdAt || b.id || 0;
          return timeB - timeA; // Más recientes primero
        });
        break;
        
      case 'priority':
        // Ordenar por prioridad (Alta=1, Media=2, Baja=3)
        sortedTasks.sort((a, b) => {
          const weightA = PRIORITY_WEIGHTS[a.priority] || 2;
          const weightB = PRIORITY_WEIGHTS[b.priority] || 2;
          return weightA - weightB; // Alta prioridad primero
        });
        break;
        
      case 'alpha':
        // Ordenar alfabéticamente (A-Z)
        sortedTasks.sort((a, b) => {
          const titleA = (a.title || '').toLowerCase();
          const titleB = (b.title || '').toLowerCase();
          return titleA.localeCompare(titleB, 'es');
        });
        break;
        
      default:
        break;
    }
    
    return sortedTasks;
  }

  /**
   * Render all filtered tasks
   */
  render() {
    if (!this.container || !this.renderer) return;

    this.container.innerHTML = '';
    const tasks = this.taskCollection.getAll();
    // Si tenemos filterBar, usamos su función de filtro actualizada
    let filteredTasks = this.filterBar 
      ? this.filterBar.createFilterFn()(tasks)
      : (this.filterFn ? this.filterFn(tasks) : tasks);

    // Aplicar ordenación
    filteredTasks = this.sortTasks(filteredTasks);

    filteredTasks.forEach(task => {
      this.container.appendChild(this.renderer.render(task));
    });
  }

  /**
   * Bind click events for task actions (edit, delete, complete) and task selection
   * @param {Object} handlers - Object with edit, delete, toggle callback functions
   */
  bindActions(handlers) {
    if (!this.container) return;

    this.container.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      // Check if clicked on an action button
      const actionButton = target.closest('.edit-task-btn, .delete-task-btn, .complete-task-btn');
      
      if (actionButton) {
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
          // Clear selection if deleted task was selected
          if (window.selectedTaskId === taskId) {
            window.clearSelectedTask();
          }
          return;
        }
        if (actionButton.classList.contains('complete-task-btn')) {
          handlers.toggle && handlers.toggle(taskId);
          // Clear selection if completed task was selected
          if (window.selectedTaskId === taskId) {
            window.clearSelectedTask();
          }
          return;
        }
      }

      // If not clicking on an action button, select the task (click on li)
      const taskItem = target.closest('li[data-task-id]');
      if (taskItem) {
        const taskId = Number(taskItem.dataset.taskId);
        if (Number.isNaN(taskId)) return;

        // Select this task
        window.selectTask(taskId);
      }
    });
  }
}