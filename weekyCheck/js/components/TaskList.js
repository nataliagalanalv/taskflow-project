/**
 * TaskList - Componente para gestionar la lista de tareas
 */

import { TaskItemRenderer } from './TaskItem.js';

export class TaskList {
  constructor(taskCollection, filterFn) {
    this.taskCollection = taskCollection;
    this.filterFn = filterFn;
    this.container = null;
    this.template = null;
    this.renderer = null;
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
   * Render all filtered tasks
   */
  render() {
    if (!this.container || !this.renderer) return;

    this.container.innerHTML = '';
    const tasks = this.taskCollection.getAll();
    const filteredTasks = this.filterFn ? this.filterFn(tasks) : tasks;

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