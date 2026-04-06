/**
 * TaskItem - Componente para renderizar un item individual de tarea
 */

import { PRIORITY_CLASS_BY_VALUE } from '../utils/constants.js';

export class TaskItemRenderer {
  constructor(template) {
    this.template = template;
  }

  /**
   * Render a single task item
   * @param {Object} task - Task object with id, title, priority, type, completed
   * @returns {DocumentFragment} Cloned template with task data
   */
  render(task) {
    const clone = this.template.content.cloneNode(true);
    const li = clone.querySelector('li');

    if (li) li.dataset.taskId = String(task.id);

    const titleSpan = clone.querySelector('.task-description');
    const priorityBadge = clone.querySelector('.badge-priority');
    const typeBadge = clone.querySelector('.badge-type');

    if (titleSpan) titleSpan.textContent = task.title;

    if (priorityBadge) {
      priorityBadge.textContent = task.priority || 'media';
      priorityBadge.className = PRIORITY_CLASS_BY_VALUE[task.priority] || PRIORITY_CLASS_BY_VALUE.media;
    }

    if (typeBadge) typeBadge.textContent = task.type || 'personal';

    if (task.completed && li) {
      li.classList.add('opacity-50');
      const titleSpan = li.querySelector('.task-description');
      if (titleSpan) {
        titleSpan.classList.add('line-through');
      }
    }

    // Mantener el resaltado si esta tarea está seleccionada
    if (window.selectedTaskId === task.id && !task.completed) {
      li.classList.add('border-fuchsia-500', 'shadow-[0_0_15px_rgba(217,70,239,0.3)]');
      li.style.borderColor = 'rgba(217, 70, 239, 0.8)';
    }

    return clone;
  }
}