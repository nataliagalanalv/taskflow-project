/**
 * TaskController - Controlador para gestionar las operaciones de tareas con API
 * Maneja operaciones asíncronas con la API externa
 */

import { taskAPI } from '../api/client.js';
import { validateNewTask } from '../utils/validations.js';

export class TaskController {
  constructor(taskCollection, onTasksChange, onError, onLoadingChange) {
    this.taskCollection = taskCollection;
    this.onTasksChange = onTasksChange;
    this.onError = onError;
    this.onLoadingChange = onLoadingChange;
    this.isLoading = false;
  }

  setLoading(state) {
    this.isLoading = state;
    if (this.onLoadingChange) this.onLoadingChange(state);
  }

  /**
   * Add a new task (async - creates in API first)
   * @param {Object} taskData - Task data (title, priority, type)
   * @returns {Promise<boolean>} True if successful
   */
  async addTask(taskData) {
    const validation = validateNewTask(taskData);
    if (!validation.ok) return false;

    this.setLoading(true);

    try {
      // Create task in API first
      const createdTask = await taskAPI.create({
        title: validation.value.title,
        completed: false,
        priority: validation.value.priority,
        type: validation.value.type,
      });

      // Add to local collection with the ID from the server
      this.taskCollection.add({
        id: createdTask.id,
        title: createdTask.title,
        completed: createdTask.completed,
        priority: createdTask.priority,
        type: createdTask.type,
        createdAt: createdTask.createdAt,
      });

      if (this.onTasksChange) this.onTasksChange();
      return true;
    } catch (error) {

      const errorMsg = error.message.includes('400') 
        ? 'El servidor indica que los datos son inválidos' 
        : 'Error de conexión con el servidor';

      if (this.onError) this.onError(errorMsg, error);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Delete a task by ID (async - deletes from API first)
   * @param {string} id - Task ID (string format from API)
   */
  async deleteTask(id) {
    this.setLoading(true);
    try {
      // Delete from API first
      await taskAPI.delete(id);
      
      // Remove from local collection
      this.taskCollection.delete(id);
      
      if (this.onTasksChange) this.onTasksChange();
    } catch (error) {
      console.error('TaskController: Error al eliminar tarea:', error);
      if (this.onError) this.onError('Error al eliminar la tarea', error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Toggle task completion status (async - updates in API first)
   * @param {string} id - Task ID (string format from API)
   */
  async toggleTask(id) {

    this.setLoading(true);
    const task = this.taskCollection.getAll().find(t => t.id === id);
    if (!task) return;

    try {
      // Update in API first
      await taskAPI.update(id, {
        ...task.toJSON(),
        completed: !task.completed,
      });

      // Update local collection
      task.toggle();
      
      if (this.onTasksChange) this.onTasksChange();
    } catch (error) {
      console.error('TaskController: Error al actualizar tarea:', error);
      if (this.onError) this.onError('Error al actualizar la tarea', error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Edit a task title (async - updates in API first)
   * @param {string} id - Task ID (string format from API)
   * @param {string} newTitle - New title
   */
  async editTask(id) {

    this.setLoading(true);
    const task = this.taskCollection.getAll().find(t => t.id === id);
    if (!task) return;

    const newTitle = prompt('Editar tarea:', task.title);
    try{
      if (newTitle && newTitle.trim() !== '') 
        await taskAPI.update(id, {
          ...task.toJSON(),
          title: newTitle.trim(),
        });
        task.updateTitle(newTitle.trim());
        if (this.onTasksChange) this.onTasksChange();

      } catch (error) {
        console.error('TaskController: Error al editar tarea:', error);
        if (this.onError) this.onError('Error al editar la tarea', error);
      } finally {
        this.setLoading(false);
      }

    }

  /**
   * Mark all tasks as completed (async - updates all in API)
   */
  async markAllCompleted() {

    this.setLoading(true);
    try {
      const tasks = this.taskCollection.getAll();
      
      // Update all tasks in API
      for (const task of tasks) {
        if (!task.completed) {
          await taskAPI.update(task.id, {
            ...task.toJSON(),
            completed: true,
          });
        }
      }

      // Update local collection
      this.taskCollection.markAllCompleted();
      
      if (this.onTasksChange) this.onTasksChange();
    } catch (error) {
      console.error('TaskController: Error al marcar todas como completadas:', error);
      if (this.onError) this.onError('Error al marcar todas como completadas', error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Delete all completed tasks (async - deletes from API)
   */
  async deleteAllCompleted() {
    this.setLoading(true);
    try {
      const completedTasks = this.taskCollection.getAll().filter(t => t.completed);
      
      // Delete all completed tasks from API
      for (const task of completedTasks) {
        await taskAPI.delete(task.id);
      }

      // Update local collection
      this.taskCollection.deleteCompleted();
      
      if (this.onTasksChange) this.onTasksChange();
    } catch (error) {
      console.error('TaskController: Error al eliminar completadas:', error);
      if (this.onError) this.onError('Error al eliminar tareas completadas', error);
    } finally {
      this.setLoading(false);
    }
  }
}
