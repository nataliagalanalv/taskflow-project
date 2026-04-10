const API_URL = '/api/v1/tasks';

/**
 * TaskAPI - Cliente para la API REST de tareas
 * Maneja todas las operaciones CRUD con la API externa
 */
export const taskAPI = {
    // Estado de carga
    isLoading: false,
    
    // Callbacks para estados de red
    onLoadingChange: null,
    onError: null,

    /**
     * Set loading state and notify listeners
     */
    setLoading(loading) {
        this.isLoading = loading;
        if (this.onLoadingChange) {
            this.onLoadingChange(loading);
        }
    },

    /**
     * Report error and notify listeners
     */
    reportError(message, error) {
        console.error(`API Error: ${message}`, error);
        if (this.onError) {
            this.onError(message, error);
        }
    },

    // Obtener todas las tareas
    async getAll() {
        this.setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            this.reportError('Error al cargar tareas', error);
            throw error;
        } finally {
            this.setLoading(false);
        }
    },

    // Crear una tarea
    async create(taskData) {
        this.setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            this.reportError('Error al crear la tarea', error);
            throw error;
        } finally {
            this.setLoading(false);
        }
    },

    // Actualizar una tarea
    async update(id, taskData) {
        this.setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            this.reportError('Error al actualizar la tarea', error);
            throw error;
        } finally {
            this.setLoading(false);
        }
    },

    // Eliminar una tarea
    async delete(id) {
        this.setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return true;
        } catch (error) {
            this.reportError('Error al eliminar la tarea', error);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }
};
