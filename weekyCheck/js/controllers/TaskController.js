/**
 * TaskController - Controlador para gestionar las operaciones de tareas
 */

import { StorageService } from '../services/StorageService.js';
import { validateNewTask } from '../utils/validations.js';

export class TaskController {
  constructor(taskCollection, onTasksChange) {
    this.taskCollection = taskCollection;
    this.onTasksChange = onTasksChange;
  }

  /**
   * Add a new task
   * @param {Object} taskData - Task data (title, priority, type)
   */
  addTask(taskData) {
    const validation = validateNewTask(taskData);
    if (!validation.ok) return false;

    this.taskCollection.add({
      id: Date.now(),
      title: validation.value.title,
      completed: false,
      priority: validation.value.priority,
      type: validation.value.type,
    });

    this.saveAndNotify();
    return true;
  }

  /**
   * Delete a task by ID
   * @param {number} id - Task ID
   */
  deleteTask(id) {
    this.taskCollection.delete(id);
    this.saveAndNotify();
  }

  /**
   * Toggle task completion status
   * @param {number} id - Task ID
   */
  toggleTask(id) {
    this.taskCollection.toggle(id);
    this.saveAndNotify();
  }

  /**
   * Edit a task title
   * @param {number} id - Task ID
   * @param {string} newTitle - New title
   */
  editTask(id) {
    const task = this.taskCollection.getAll().find(t => t.id === id);
    if (!task) return;

    const newTitle = prompt('Editar tarea:', task.title);
    if (newTitle && newTitle.trim() !== '') {
      task.updateTitle(newTitle.trim());
      this.saveAndNotify();
    }
  }

  /**
   * Mark all tasks as completed
   */
  markAllCompleted() {
    this.taskCollection.markAllCompleted();
    this.saveAndNotify();
  }

  /**
   * Delete all completed tasks
   */
  deleteAllCompleted() {
    this.taskCollection.deleteCompleted();
    this.saveAndNotify();
  }

  /**
   * Save tasks to storage and notify change
   */
  saveAndNotify() {
    StorageService.saveTasks(this.taskCollection.toJSON());
    if (this.onTasksChange) this.onTasksChange();
  }
}