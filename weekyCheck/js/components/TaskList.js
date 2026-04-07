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
   * Renderiza todas las tareas aplicando el flujo de filtrado cruzado.
   * 
   * Esta función implementa un sistema de filtrado múltiple que combina varios criterios:
   * 1. **Búsqueda de texto**: Filtra tareas cuyo título coincide con el texto de búsqueda (insensitive)
   * 2. **Filtro de prioridad**: Filtra por nivel de prioridad (alta, media, baja)
   * 3. **Filtro de tipo**: Filtra por tipo de tarea (ej: trabajo, personal, etc.)
   * 4. **Filtro de estado**: Filtra por estado (todas, pendientes, completadas)
   * 5. **Ordenación**: Ordena el resultado por fecha, prioridad o alfabéticamente
   * 
   * El proceso de filtrado es acumulativo - una tarea debe cumplir TODOS los criterios activos
   * para ser incluida en el resultado final. Si un filtro está en "all" o vacío, no aplica restricción.
   * 
   * Después del filtrado, las tareas se ordenan según el criterio seleccionado y se renderizan
   * en el DOM usando el renderer de TaskItem.
   * 
   * @function renderAllTasks
   * @returns {void}
   * 
   * @example
   * // Flujo de filtrado:
   * // 1. Obtener todas las tareas: [tarea1, tarea2, tarea3, ...]
   * // 2. Aplicar filtros cruzados:
   * //    - Búsqueda: "informe" → filtra por título
   * //    - Prioridad: "alta" → solo tareas de prioridad alta
   * //    - Tipo: "trabajo" → solo tareas de tipo trabajo
   * //    - Estado: "pending" → solo tareas no completadas
   * // 3. Resultado filtrado: [tarea2, tarea5] (cumplen todos los criterios)
   * // 4. Ordenar por prioridad → [tarea5, tarea2]
   * // 5. Renderizar en el DOM
   * taskList.render();
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
   * Gestiona los eventos de los botones de acción de las tareas y la selección de tareas.
   * 
   * Esta función implementa un sistema de delegación de eventos que maneja tres tipos de acciones:
   * 1. **Editar tarea**: Dispara el callback `edit` cuando se hace click en el botón de edición
   * 2. **Eliminar tarea**: Dispara el callback `delete` y limpia la selección si la tarea estaba seleccionada
   * 3. **Completar tarea**: Dispara el callback `toggle` y limpia la selección si la tarea estaba seleccionada
   * 
   * Además, permite seleccionar una tarea para el modo enfoque haciendo click directamente sobre ella
   * (siempre que no se haya hecho click en un botón de acción).
   * 
   * El sistema utiliza event delegation en el contenedor padre para mejorar el rendimiento,
   * evitando tener que añadir listeners individuales a cada tarea.
   * 
   * @function managerTask
   * @param {Object} handlers - Objeto con callbacks para las acciones de tareas:
   *   @param {Function} handlers.edit - Callback ejecutado al editar una tarea (recibe taskId)
   *   @param {Function} handlers.delete - Callback ejecutado al eliminar una tarea (recibe taskId)
   *   @param {Function} handlers.toggle - Callback ejecutado al completar/descompletar una tarea (recibe taskId)
   * @returns {void}
   * 
   * @example
   * // Configurar manejadores de tareas
   * taskList.bindActions({
   *   edit: (taskId) => taskController.editTask(taskId),
   *   delete: (taskId) => taskController.deleteTask(taskId),
   *   toggle: (taskId) => taskController.toggleTask(taskId)
   * });
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

        // Keep taskId as string to match API format (server uses Date.now().toString())
        const taskId = taskItem.dataset.taskId;
        if (!taskId) return;

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
        // Keep taskId as string to match API format (server uses Date.now().toString())
        const taskId = taskItem.dataset.taskId;
        if (!taskId) return;

        // Select this task
        window.selectTask(taskId);
      }
    });
  }
}