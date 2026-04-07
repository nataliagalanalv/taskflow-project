# Migración de LocalStorage a API Externa - WeekyCheck

## Resumen de Cambios

Este documento describe los cambios realizados para migrar la persistencia de datos de LocalStorage a una API externa REST.

## Archivos Modificados

### 1. `js/api/client.js`
- **Mejoras realizadas:**
  - Añadidos estados de carga (`isLoading`)
  - Implementados callbacks para notificaciones de estado (`onLoadingChange`, `onError`)
  - Añadido método `update()` para actualizar tareas existentes
  - Mejor manejo de errores con try/catch en todas las operaciones
  - Notificaciones automáticas de errores al UI

### 2. `js/services/StorageService.js`
- **Cambios principales:**
  - `loadTasks()` ahora es asíncrono y obtiene datos de la API
  - Eliminada dependencia de localStorage para tareas
  - Mantenida localStorage solo para preferencias de tema
  - Añadido método `syncTasks()` para compatibilidad
  - Validación de datos mantenida para integridad

### 3. `js/controllers/TaskController.js`
- **Transformación a asíncrono:**
  - Todos los métodos ahora son `async`
  - Operaciones API-first: primero se guarda en servidor, luego local
  - Añadido callback `onError` para manejo de errores
  - Mejor propagación de errores al UI

### 4. `js/app.js`
- **Nuevas funcionalidades:**
  - Inicialización asíncrona con `async init()`
  - Sistema de estados de carga con spinner visual
  - Banner de errores con auto-ocultado (5 segundos)
  - Callbacks de API configurados en el constructor
  - Manejo de errores de conexión al servidor

### 5. `js/components/FocusMode.js`
- **Métodos añadidos:**
  - `setTaskCollection()` - Actualiza referencia tras carga asíncrona
  - `setTaskController()` - Actualiza referencia tras carga asíncrona

## Estados de Red Implementados

### 1. Estado de Carga
- **Spinner animado** mientras se cargan datos del servidor
- **Mensaje visual** "Cargando tareas..."
- **Transiciones suaves** entre estados

### 2. Manejo de Errores
- **Banner rojo** en esquina superior derecha
- **Icono de advertencia** (⚠️)
- **Mensaje descriptivo** del error
- **Auto-ocultado** después de 5 segundos
- **Botón para cerrar** manualmente

### 3. Actualización en Tiempo Real
- **Refresco automático** tras crear/eliminar tareas
- **Sincronización** con respuesta del servidor
- **IDs asignados por servidor** usados localmente

## Flujo de Operaciones

### Crear Tarea
1. Usuario envía formulario
2. `TaskController.addTask()` llama a `taskAPI.create()`
3. API responde con tarea creada (incluye ID del servidor)
4. Tarea se añade a colección local con ID del servidor
5. UI se actualiza automáticamente

### Eliminar Tarea
1. Usuario hace click en botón eliminar
2. `TaskController.deleteTask()` llama a `taskAPI.delete()`
3. API confirma eliminación
4. Tarea se elimina de colección local
5. UI se actualiza automáticamente

### Completar Tarea
1. Usuario hace click en botón completar
2. `TaskController.toggleTask()` llama a `taskAPI.update()`
3. API actualiza estado
4. Estado local se actualiza
5. UI se actualiza automáticamente

## Configuración del Servidor

El servidor debe estar corriendo en `http://localhost:3000` con los siguientes endpoints:

- `GET /api/v1/tasks` - Obtener todas las tareas
- `POST /api/v1/tasks` - Crear nueva tarea
- `PUT /api/v1/tasks/:id` - Actualizar tarea
- `DELETE /api/v1/tasks/:id` - Eliminar tarea

## Consideraciones de Diseño

- **Mantenimiento del estilo neón**: Todos los componentes visuales mantienen su diseño original
- **Responsive**: El diseño responsivo se mantiene intacto
- **Type="module"**: Ya estaba configurado en index.html
- **Transiciones suaves**: Spinner y banners con animaciones CSS

## Pruebas Recomendadas

1. **Sin servidor**: Verificar que aparece banner de error
2. **Con servidor**: Verificar carga inicial de tareas
3. **Crear tarea**: Verificar que aparece tras respuesta del servidor
4. **Eliminar tarea**: Verificar que desaparece tras confirmación
5. **Completar tarea**: Verificar cambio de estado
6. **Filtros**: Verificar que funcionan con datos de API

## Notas Importantes

- Las tareas ahora se persisten en el servidor, no en el navegador
- El tema (dark/light) sigue guardado en localStorage
- Los errores de red se manejan gracefulmente
- La aplicación es completamente funcional sin conexión inicial (muestra error)
- El backup exportado contiene las tareas actuales en memoria

## Futuras Mejoras Sugeridas

1. **Cache local**: Implementar IndexedDB para modo offline
2. **Reintentos automáticos**: Para errores temporales de red
3. **Optimistic updates**: Actualizar UI antes de confirmación del servidor
4. **Sync en segundo plano**: Sincronizar cuando se recupera conexión
5. **Indicador de conexión**: Mostrar estado de conectividad en UI