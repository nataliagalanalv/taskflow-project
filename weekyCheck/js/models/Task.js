/**
 * Task Model - Define la estructura y comportamiento de una tarea
 */
export class Task {
  constructor({ id, title, completed = false, priority = 'media', type = 'personal', createdAt = null }) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.priority = priority;
    this.type = type;
    this.createdAt = createdAt;
  }

  toggle() {
    this.completed = !this.completed;
  }

  updateTitle(newTitle) {
    this.title = newTitle;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      priority: this.priority,
      type: this.type,
    };
  }
}

/**
 * TaskCollection - Gestiona una colección de tareas
 */
export class TaskCollection {
  constructor(tasks = []) {
    this.tasks = tasks.map(t => t instanceof Task ? t : new Task(t));
  }

  add(taskData) {
    const task = new Task(taskData);
    this.tasks.push(task);
    return task;
  }

  delete(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  toggle(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) task.toggle();
  }

  markAllCompleted() {
    this.tasks.forEach(task => task.completed = true);
  }

  deleteCompleted() {
    this.tasks = this.tasks.filter(task => !task.completed);
  }

  getAll() {
    return this.tasks;
  }

  get stats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percentage };
  }

  toJSON() {
    return this.tasks.map(t => t.toJSON());
  }
}