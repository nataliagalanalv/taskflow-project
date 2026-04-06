/**
 * StorageService - Maneja la persistencia robusta en localStorage
 * 
 * Este servicio implementa un sistema de persistencia con:
 * 1. Manejo de errores con try/catch en todas las operaciones
 * 2. Validación de datos antes de guardar y después de leer
 * 3. Funciones para limpiar datos corruptos o innecesarios
 * 
 * Importancia de validar datos al leer de LocalStorage:
 * - Los datos en LocalStorage pueden ser modificados manualmente por el usuario
 * - Pueden ocurrir errores de serialización/deserialización JSON
 * - Los datos pueden corromperse por actualizaciones de la aplicación
 * - Previene errores en cascada cuando la aplicación consume datos inválidos
 * - Garantiza la integridad y consistencia de los datos en la aplicación
 */

const STORAGE_KEYS = {
  TASKS: 'tasks',
  THEME: 'theme',
};

// Estructura esperada para una tarea válida
const TASK_STRUCTURE = {
  requiredFields: ['id', 'title', 'completed'],
  validFieldTypes: {
    id: 'string',
    title: 'string',
    description: 'string',
    completed: 'boolean',
    createdAt: 'string',
    updatedAt: 'string',
    dueDate: 'string',
    priority: 'string',
    category: 'string',
    tags: 'object' // array
  }
};

export class StorageService {
  /**
   * Valida que un objeto tarea tenga la estructura correcta
   * @param {Object} task - Objeto tarea a validar
   * @returns {boolean} True si la tarea es válida, false en caso contrario
   */
  static validateTaskStructure(task) {
    if (!task || typeof task !== 'object') {
      console.warn('StorageService: Tarea inválida - no es un objeto', task);
      return false;
    }

    // Verificar campos requeridos
    for (const field of TASK_STRUCTURE.requiredFields) {
      if (!(field in task)) {
        console.warn(`StorageService: Tarea inválida - falta campo requerido: ${field}`, task);
        return false;
      }
    }

    // Verificar tipos de campos
    for (const [field, expectedType] of Object.entries(TASK_STRUCTURE.validFieldTypes)) {
      if (field in task && task[field] !== null && task[field] !== undefined) {
        const actualType = Array.isArray(task[field]) ? 'object' : typeof task[field];
        if (actualType !== expectedType) {
          console.warn(`StorageService: Tarea inválida - campo ${field} tiene tipo incorrecto`, task);
          return false;
        }
      }
    }

    // Validaciones específicas
    if (typeof task.id !== 'string' || task.id.trim() === '') {
      console.warn('StorageService: Tarea inválida - id debe ser string no vacío', task);
      return false;
    }

    if (typeof task.title !== 'string' || task.title.trim() === '') {
      console.warn('StorageService: Tarea inválida - title debe ser string no vacío', task);
      return false;
    }

    if (typeof task.completed !== 'boolean') {
      console.warn('StorageService: Tarea inválida - completed debe ser booleano', task);
      return false;
    }

    return true;
  }

  /**
   * Valida y filtra un array de tareas, eliminando las inválidas
   * @param {Array} tasks - Array de tareas a validar
   * @returns {Array} Array solo con tareas válidas
   */
  static validateTasksArray(tasks) {
    if (!Array.isArray(tasks)) {
      console.warn('StorageService: Datos inválidos - no es un array', tasks);
      return [];
    }

    const validTasks = [];
    const invalidCount = { count: 0 };

    for (const task of tasks) {
      if (this.validateTaskStructure(task)) {
        validTasks.push(task);
      } else {
        invalidCount.count++;
      }
    }

    if (invalidCount.count > 0) {
      console.warn(`StorageService: Se eliminaron ${invalidCount.count} tareas inválidas`);
    }

    return validTasks;
  }

  /**
   * Valida que el tema sea uno de los permitidos
   * @param {string} theme - Tema a validar
   * @returns {boolean} True si el tema es válido
   */
  static validateTheme(theme) {
    return theme === 'dark' || theme === 'light';
  }

  /**
   * Loads tasks from localStorage con validación de datos
   * @returns {Array} Array de tareas válidas o array vacío si hay errores
   * 
   * Importancia de validar al leer:
   * - Previene que datos corruptos o malformados causen errores en la aplicación
   * - Los usuarios pueden modificar LocalStorage manualmente
   * - Las actualizaciones de la app pueden cambiar la estructura esperada
   * - Garantiza que solo datos consistentes entren al flujo de la aplicación
   */
  static loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      
      // Si no hay datos guardados, retornar array vacío
      if (!saved) {
        return [];
      }

      // Intentar parsear el JSON
      let parsed;
      try {
        parsed = JSON.parse(saved);
      } catch (parseError) {
        console.error('StorageService: Error al parsear JSON de tareas:', parseError);
        // Si el JSON está corrupto, limpiar el storage y retornar array vacío
        this.clearTasks();
        return [];
      }

      // Validar que sea un array
      if (!Array.isArray(parsed)) {
        console.warn('StorageService: Datos de tareas no son un array, limpiando storage');
        this.clearTasks();
        return [];
      }

      // Validar y filtrar tareas individuales
      const validTasks = this.validateTasksArray(parsed);
      
      // Si se eliminaron tareas inválidas, guardar la versión corregida
      if (validTasks.length !== parsed.length) {
        console.log('StorageService: Guardando versión corregida tras validación');
        this.saveTasks(validTasks);
      }

      return validTasks;

    } catch (error) {
      console.error('StorageService: Error crítico al cargar tareas:', error);
      // En caso de error crítico, limpiar storage para evitar corrupción
      try {
        this.clearTasks();
      } catch (clearError) {
        console.error('StorageService: Error al limpiar storage tras fallo crítico:', clearError);
      }
      return [];
    }
  }

  /**
   * Saves tasks array to localStorage con validación previa
   * @param {Array} tasks - Array de objetos tarea a guardar
   * @returns {boolean} True si se guardó exitosamente, false en caso de error
   */
  static saveTasks(tasks) {
    try {
      // Validar que sea un array
      if (!Array.isArray(tasks)) {
        console.error('StorageService: saveTasks requiere un array como parámetro');
        return false;
      }

      // Validar cada tarea antes de guardar
      const validTasks = this.validateTasksArray(tasks);
      
      if (validTasks.length !== tasks.length) {
        console.warn(`StorageService: ${tasks.length - validTasks.length} tareas inválidas fueron filtradas`);
      }

      // Serializar a JSON
      const serialized = JSON.stringify(validTasks);
      
      // Guardar en localStorage
      localStorage.setItem(STORAGE_KEYS.TASKS, serialized);
      
      return true;

    } catch (error) {
      console.error('StorageService: Error al guardar tareas:', error);
      
      // Si es error de cuota excedida, intentar limpiar espacio
      if (error.name === 'QuotaExceededError') {
        console.warn('StorageService: Cuota de almacenamiento excedida');
        // Podríamos implementar lógica para limpiar tareas antiguas
      }
      
      return false;
    }
  }

  /**
   * Limpia todas las tareas del localStorage
   * @returns {boolean} True si se limpió exitosamente, false en case de error
   */
  static clearTasks() {
    try {
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      console.log('StorageService: Todas las tareas han sido eliminadas');
      return true;
    } catch (error) {
      console.error('StorageService: Error al limpiar tareas:', error);
      return false;
    }
  }

  /**
   * Limpia todos los datos de la aplicación en localStorage
   * @returns {boolean} True si se limpió exitosamente, false en case de error
   */
  static clearAll() {
    try {
      // Limpiar todas las keys conocidas
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('StorageService: Todos los datos han sido eliminados');
      return true;
    } catch (error) {
      console.error('StorageService: Error al limpiar todos los datos:', error);
      return false;
    }
  }

  /**
   * Loads the saved theme preference from localStorage con validación
   * @returns {string|null} 'dark', 'light', or null if not set or invalid
   */
  static loadTheme() {
    try {
      const t = localStorage.getItem(STORAGE_KEYS.THEME);
      
      // Si no hay tema guardado, retornar null
      if (!t) {
        return null;
      }

      // Validar que el tema sea uno de los permitidos
      if (this.validateTheme(t)) {
        return t;
      } else {
        console.warn('StorageService: Tema inválido encontrado en storage:', t);
        // Limpiar tema inválido
        localStorage.removeItem(STORAGE_KEYS.THEME);
        return null;
      }
    } catch (error) {
      console.error('StorageService: Error al cargar tema:', error);
      return null;
    }
  }

  /**
   * Saves the theme preference to localStorage
   * @param {string} theme - Theme value ('dark' or 'light')
   * @returns {boolean} True si se guardó exitosamente, false en caso de error
   */
  static saveTheme(theme) {
    try {
      // Validar que el tema sea válido antes de guardar
      if (!this.validateTheme(theme)) {
        console.error('StorageService: Tema inválido:', theme);
        return false;
      }

      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      return true;
    } catch (error) {
      console.error('StorageService: Error al guardar tema:', error);
      return false;
    }
  }

  /**
   * Obtiene estadísticas de almacenamiento utilizadas
   * @returns {Object} Objeto con información del almacenamiento
   */
  static getStorageStats() {
    try {
      let totalSize = 0;
      const stats = {
        totalKeys: 0,
        tasksCount: 0,
        totalSizeKB: 0,
        tasksSizeKB: 0
      };

      // Contar todas las keys
      stats.totalKeys = localStorage.length;

      // Calcular tamaño de datos de tareas
      const tasksData = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (tasksData) {
        const tasksBytes = new TextEncoder().encode(tasksData).length;
        stats.tasksSizeKB = (tasksBytes / 1024).toFixed(2);
        
        // Contar tareas
        try {
          const tasksArray = JSON.parse(tasksData);
          if (Array.isArray(tasksArray)) {
            stats.tasksCount = tasksArray.length;
          }
        } catch (e) {
          // Si no se puede parsear, dejar en 0
        }
      }

      // Calcular tamaño total aproximado
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += new TextEncoder().encode(value).length;
        }
      }
      stats.totalSizeKB = (totalSize / 1024).toFixed(2);

      return stats;
    } catch (error) {
      console.error('StorageService: Error al obtener estadísticas:', error);
      return null;
    }
  }
}

// Export functions for backward compatibility
export const loadTasks = StorageService.loadTasks;
export const saveTasks = StorageService.saveTasks;
export const loadTheme = StorageService.loadTheme;
export const saveTheme = StorageService.saveTheme;