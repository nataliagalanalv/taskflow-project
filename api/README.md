# API REST - TaskFlow

## Descripción Técnica

API RESTful desarrollada con Node.js y Express para la gestión de tareas del proyecto TaskFlow. Implementa una arquitectura limpia con separación de responsabilidades y se comunica con una base de datos MongoDB para la persistencia de datos.

## Arquitectura y Diseño

### Patrón de Diseño: **Arquitectura por Capas (Layered Architecture)**

La API sigue un patrón de **Arquitectura por Capas** (también conocido como N-Tier), que organiza el código en niveles lógicos con responsabilidades bien definidas:

```
┌─────────────────────────────────────────────────────────────┐
│                         Capa de Rutas                       │
│                    (task.routes.js)                         │
│  • Define endpoints y mapea a controladores                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Capa de Controladores                  │
│                   (task.controller.js)                      │
│  • Maneja request/response                                  │
│  • Valida datos de entrada                                  │
│  • Coordina con servicios                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Capa de Servicios                     │
│                    (task.service.js)                        │
│  • Lógica de negocio pura                                   │
│  • Operaciones CRUD                                         │
│  • Manejo de errores específicos                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Capa de Modelos                        │
│                     (task.model.js)                         │
│  • Esquema de datos                                         │
│  • Validaciones de MongoDB                                  │
│  • Métodos de instancia                                     │
└─────────────────────────────────────────────────────────────┘
```

### Justificación de la Organización

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad única y bien definida
2. **Mantenibilidad**: Los cambios en una capa no afectan directamente a las demás
3. **Testabilidad**: Cada capa puede ser probada de forma independiente
4. **Escalabilidad**: Facilita la adición de nuevas funcionalidades
5. **Reutilización**: Los servicios pueden ser utilizados por múltiples controladores

### Estructura de Directorios

```
api/
├── 📄 index.js                 # Entry point - Configuración del servidor Express
├── 📄 package.json             # Dependencias y scripts del proyecto
├── 📄 db.js                    # Conexión a MongoDB
├── 📁 config/
│   └── 📄 env.js              # Configuración de variables de entorno
├── 📁 routes/
│   └── 📄 task.routes.js      # Definición de rutas y endpoints
├── 📁 controllers/
│   └── 📄 task.controller.js  # Lógica de controladores (request/response)
├── 📁 services/
│   └── 📄 task.service.js     # Lógica de negocio y operaciones de datos
└── 📁 models/
    └── 📄 task.model.js       # Modelo de datos (esquema Mongoose)
```

## Middlewares

Los middlewares son funciones que se ejecutan en el ciclo de vida de cada petición HTTP, permitiendo interceptar, validar y transformar los datos antes de llegar a las rutas.

### 1. **CORS (Cross-Origin Resource Sharing)**
```javascript
app.use(cors());
```
- **Propósito**: Permite que el frontend (en diferente origen/puerto) pueda comunicarse con la API
- **Funcionamiento**: Añade headers HTTP que permiten el acceso cross-origin
- **Configuración**: Por defecto permite todas las origins (en desarrollo)

### 2. **JSON Parser (express.json())**
```javascript
app.use(express.json());
```
- **Propósito**: Parsea el body de las peticiones HTTP a objetos JavaScript
- **Funcionamiento**: Convierte JSON string a objeto JavaScript accesible mediante `req.body`
- **Uso**: Permite trabajar con datos JSON en los controladores

### 3. **Error Handler (Manejador de Errores Global)**
```javascript
app.use((err, req, res, next) => {
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({
            error: 'Recurso no encontrado',
            message: 'La tarea que intentas manipular no existe.'
        });
    }

    if (err.message === 'VALIDATION_ERROR') {
        return res.status(400).json({
            error: 'Datos incorrectos',
            message: 'El formato de la tarea no es válido.'
        });
    }

    console.error('❌ TRAZA DEL ERROR:', err.stack);

    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Algo salió mal en nuestros servidores. Inténtalo más tarde.'
    });
});
```

- **Propósito**: Manejo centralizado y semántico de errores
- **Funcionamiento**: Intercepta errores lanzados en capas inferiores y los mapea a respuestas HTTP apropiadas
- **Tipos de Errores Manejados**:
  - `NOT_FOUND` → 404 (Recurso no encontrado)
  - `VALIDATION_ERROR` → 400 (Error de validación)
  - Otros errores → 500 (Error interno del servidor)

## Endpoints y Ejemplos

### Base URL
```
http://localhost:3000/api/v1/tasks
```

### 1. **GET /api/v1/tasks** - Obtener todas las tareas

**Descripción**: Recupera el listado completo de tareas almacenadas en la base de datos.

**Códigos de Respuesta**:
- `200 OK` - Éxito
- `500 Internal Server Error` - Error del servidor

**Ejemplo con cURL**:
```bash
curl -X GET http://localhost:3000/api/v1/tasks
```

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id": "65e1a2b3c4d5e6f7g8h9i0j1",
    "title": "Comprar leche",
    "priority": "normal",
    "type": "personal",
    "completed": false,
    "createdAt": "2026-04-13T14:30:00.000Z"
  },
  {
    "id": "65e1a2b3c4d5e6f7g8h9i0j2",
    "title": "Reunión de equipo",
    "priority": "alta",
    "type": "trabajo",
    "completed": false,
    "createdAt": "2026-04-13T15:00:00.000Z"
  }
]
```

---

### 2. **POST /api/v1/tasks** - Crear nueva tarea

**Descripción**: Crea una nueva tarea en la base de datos.

**Códigos de Respuesta**:
- `201 Created` - Tarea creada exitosamente
- `400 Bad Request` - Datos inválidos (título vacío)
- `500 Internal Server Error` - Error del servidor

**Ejemplo con cURL**:
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reunión de equipo",
    "priority": "alta",
    "type": "trabajo"
  }'
```

**Cuerpo de la Petición (Request Body)**:
```json
{
  "title": "Reunión de equipo",
  "priority": "alta",
  "type": "trabajo"
}
```

**Respuesta Exitosa (201 Created)**:
```json
{
  "id": "65e1a2b3c4d5e6f7g8h9i0j3",
  "title": "Reunión de equipo",
  "priority": "alta",
  "type": "trabajo",
  "completed": false,
  "createdAt": "2026-04-13T15:30:00.000Z"
}
```

**Respuesta de Error (400 Bad Request)**:
```json
{
  "error": "El título es obligatorio"
}
```

---

### 3. **PUT /api/v1/tasks/:id** - Actualizar tarea completa

**Descripción**: Actualiza todos los campos de una tarea existente.

**Códigos de Respuesta**:
- `200 OK` - Tarea actualizada exitosamente
- `404 Not Found` - Tarea no encontrada
- `500 Internal Server Error` - Error del servidor

**Ejemplo con cURL**:
```bash
curl -X PUT http://localhost:3000/api/v1/tasks/65e1a2b3c4d5e6f7g8h9i0j1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Comprar leche y pan",
    "priority": "baja",
    "type": "personal",
    "completed": false
  }'
```

**Cuerpo de la Petición (Request Body)**:
```json
{
  "title": "Comprar leche y pan",
  "priority": "baja",
  "type": "personal",
  "completed": false
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "65e1a2b3c4d5e6f7g8h9i0j1",
  "title": "Comprar leche y pan",
  "priority": "baja",
  "type": "personal",
  "completed": false,
  "createdAt": "2026-04-13T14:30:00.000Z"
}
```

**Respuesta de Error (404 Not Found)**:
```json
{
  "error": "Recurso no encontrado",
  "message": "La tarea que intentas manipular no existe."
}
```

---

### 4. **DELETE /api/v1/tasks/:id** - Eliminar tarea

**Descripción**: Elimina permanentemente una tarea de la base de datos.

**Códigos de Respuesta**:
- `204 No Content` - Tarea eliminada exitosamente
- `404 Not Found` - Tarea no encontrada
- `500 Internal Server Error` - Error del servidor

**Ejemplo con cURL**:
```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/65e1a2b3c4d5e6f7g8h9i0j1
```

**Respuesta Exitosa (204 No Content)**:
```
(No content body)
```

**Respuesta de Error (404 Not Found)**:
```json
{
  "error": "Recurso no encontrado",
  "message": "La tarea que intentas manipular no existe."
}
```

---

### 5. **PATCH /api/v1/tasks/:id/completar** - Marcar tarea como completada

**Descripción**: Actualiza el estado de una tarea a "completada".

**Códigos de Respuesta**:
- `200 OK` - Tarea completada exitosamente
- `404 Not Found` - Tarea no encontrada
- `500 Internal Server Error` - Error del servidor

**Ejemplo con cURL**:
```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/65e1a2b3c4d5e6f7g8h9i0j1/completar
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "65e1a2b3c4d5e6f7g8h9i0j1",
  "title": "Comprar leche",
  "priority": "normal",
  "type": "personal",
  "completed": true,
  "createdAt": "2026-04-13T14:30:00.000Z"
}
```

---

## Variables de Entorno

La API requiere las siguientes variables de entorno para su correcto funcionamiento:

| Variable | Descripción | Ejemplo | Requerida |
|----------|-------------|---------|-----------|
| `PORT` | Puerto en el que se ejecutará el servidor | `3000` | No (default: 3000) |
| `MONGODB_URI` | URI de conexión a la base de datos MongoDB | `mongodb://localhost:27017/weekycheck` | Sí |

### Configuración de Variables de Entorno

1. **Crear archivo `.env`** en la carpeta `/api`:
   ```bash
   touch .env
   ```

2. **Agregar las variables**:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/weekycheck
   ```

3. **Cargar variables** (automático con dotenv):
   ```javascript
   require('dotenv').config();
   ```

### Archivo de Configuración (`config/env.js`)

```javascript
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000
};
```

Este módulo centraliza la configuración y proporciona valores por defecto.

## Modelo de Datos

### Esquema de Tarea (Task Model)

```javascript
{
  title: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    default: 'normal'
  },
  type: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Campos**:
- `title` (String, requerido): Título de la tarea
- `priority` (String, opcional): Prioridad (normal, alta, baja)
- `type` (String, opcional): Tipo de tarea (personal, trabajo)
- `completed` (Boolean, default: false): Estado de completitud
- `createdAt` (Date, auto): Fecha de creación

## Instrucciones de Ejecución

### Modo Desarrollo (con auto-reload)
```bash
cd api
npm run dev
```

### Modo Producción
```bash
cd api
npm start
```

### Verificación de Estado (Health Check)
```bash
curl http://localhost:3000/api/health
```

**Respuesta**:
```json
{
  "status": "ok",
  "message": "API de WeekyCheck funcionando correctamente"
}
```

## 📦 Dependencias

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `express` | ^4.18.2 | Framework web para Node.js |
| `mongoose` | ^9.4.1 | ODM para MongoDB |
| `cors` | ^2.8.5 | Middleware para habilitar CORS |
| `dotenv` | ^16.0.0 | Carga de variables de entorno |
| `nodemon` | ^3.0.0 | Auto-reload en desarrollo (devDep) |

---

**Documentación técnica creada para el proyecto TaskFlow**