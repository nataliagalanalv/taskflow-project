# 🚀 TaskFlow (WeekyCheck) - Proyecto Fullstack

<div align="center">

![Estado](https://img.shields.io/badge/estado-completado-green)
![Versión](https://img.shields.io/badge/versión-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-yellow)

**Aplicación de gestión de tareas con arquitectura fullstack moderna**

[Características](#-características) • [Arquitectura](#-arquitectura-del-proyecto) • [API](#-api-rest) • [Instalación](#-instalación-y-ejecución)

</div>

---

## Índice

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Características](#-características)
3. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
4. [Flujo de Datos - Capa de Red](#-flujo-de-datos---capa-de-red)
5. [Backend - Explicación Técnica](#-backend---explicación-técnica)
6. [API REST](#-api-rest)
7. [Gestión de Estados de UI](#-gestión-de-estados-de-ui)
8. [Ejemplos Prácticos](#-ejemplos-prácticos)
9. [Instalación y Ejecución](#-instalación-y-ejecución)
10. [Tecnologías Utilizadas](#-tecnologías-utilizadas)

---

## Descripción del Proyecto

**TaskFlow** (también conocido como **WeekyCheck**) es una aplicación fullstack de gestión de tareas que implementa una arquitectura moderna separando responsabilidades entre frontend y backend.

Este proyecto representa la **Fase 1** de migración desde una aplicación basada en `localStorage` hacia una arquitectura cliente-servidor completa, implementando:

- **API REST propia** en Node.js con Express
- **Gestión de estados de red** en el frontend (loading, success, error)
- **Comunicación asíncrona** mediante `fetch` y `async/await`
- **Persistencia de datos** en el servidor
- **Interfaz reactiva** con feedback visual ante fallos

---

## Características

### Funcionalidades Principales
- 📝 **CRUD completo de tareas** - Crear, leer, actualizar y eliminar tareas
- 🎯 **Sistema de prioridades** - Baja 🟢, Media 🟡, Alta 🔴
- 📂 **Clasificación por tipo** - Personal / Trabajo
- 🔍 **Filtros y búsqueda** - Por estado, prioridad, tipo y texto
- 🌙 **Modo oscuro/claro** - Tema configurable persistente
- ⏱️ **Temporizador Pomodoro** - 25 minutos de enfoque
- 📊 **Estadísticas en tiempo real** - Progreso visual con gráfico radial
- 💾 **Exportar backup** - Descarga de tareas en formato JSON

### Características Técnicas
- 🔄 **Sincronización en tiempo real** con la API
- ⚡ **Operaciones asíncronas** no bloqueantes
- 🛡️ **Validación de datos** en cliente y servidor
- 🎨 **UI reactiva** con Tailwind CSS
- 📱 **Diseño responsive** multiplataforma

---

## Arquitectura del Proyecto

### Estructura de Carpetas

```
taskflow-project/
├── 📁 weekyCheck/              # Frontend (Single Page Application)
│   ├── index.html              # Punto de entrada HTML
│   ├── css/                    # Estilos CSS
│   │   └── main.css           # Estilos principales + Tailwind
│   ├── js/                     # Código JavaScript modular (ES6)
│   │   ├── app.js              # Entry point - Orquestador principal
│   │   ├── api/
│   │   │   └── client.js       # Cliente API REST (fetch)
│   │   ├── models/
│   │   │   └── Task.js         # Modelo de datos Task
│   │   ├── services/
│   │   │   ├── StorageService.js  # Persistencia (API + localStorage)
│   │   │   └── ThemeService.js    # Gestión de tema claro/oscuro
│   │   ├── controllers/
│   │   │   └── TaskController.js  # Lógica de negocio CRUD
│   │   ├── components/
│   │   │   ├── TaskList.js     # Lista de tareas
│   │   │   ├── TaskItem.js     # Item individual
│   │   │   ├── StatsPanel.js   # Panel de estadísticas
│   │   │   ├── FilterBar.js    # Filtros y búsqueda
│   │   │   ├── Timer.js        # Temporizador Pomodoro
│   │   │   └── FocusMode.js    # Modo enfoque
│   │   └── utils/
│   │       ├── validations.js  # Validaciones de formularios
│   │       ├── constants.js    # Constantes de la app
│   │       └── dateFormatter.js # Utilidades de fecha
│   └── assets/                 # Recursos estáticos
│
├── 📁 server/                  # Backend (Node.js + Express)
│   ├── package.json            # Dependencias del servidor
│   └── src/
│       ├── index.js            # Entry point - Configuración Express
│       ├── config/
│       │   └── env.js          # Variables de entorno (PORT)
│       ├── routes/
│       │   └── task.routes.js  # Definición de rutas (Router)
│       ├── controllers/
│       │   └── task.controller.js  # Lógica de request/response
│       └── services/
│           └── task.service.js     # Lógica de negocio y datos
│
└── README.md                   # Esta documentación
```

### ¿Por qué esta separación de responsabilidades?

| Capa | Tecnología | Responsabilidad |
|------|------------|-----------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Interfaz de usuario, experiencia, validación cliente |
| **API Client** | `fetch` API, async/await | Comunicación HTTP, gestión de estados de red |
| **Backend** | Node.js, Express | Servidor HTTP, routing, middleware |
| **Servicio** | JavaScript puro | Lógica de negocio, manipulación de datos |
| **Persistencia** | Memoria (RAM) | Almacenamiento temporal de tareas |

---

## Flujo de Datos - Capa de Red

### Arquitectura de Comunicación

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                  │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    WeekyCheckApp (app.js)                       ││
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  ││
│  │  │ TaskController  │───▶│   taskAPI       │───▶│   fetch    │  ││
│  │  │   (lógica)      │    │  (cliente HTTP) │    │  (HTTP)     │  ││
│  │  └─────────────────┘    └─────────────────┘    └─────────────┘  ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ HTTP (JSON)
┌─────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                   │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    Express Server (index.js)                    ││
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────   ││
│  │  │   CORS          │───▶│   Router        │───▶│ Controller │  ││
│  │  │  (middleware)   │    │  (task.routes)  │    │  (lógica)   │  ││
│  │  └─────────────────┘    └─────────────────┘    └─────────────┘  ││
│  │                                                      │          ││
│  │                                                      ▼          ││
│  │                                               ┌─────────────┐   ││
│  │                                               │  Service    │   ││
│  │                                               │ (task.service)│ ││
│  │                                               └─────────────┘   ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### `js/api/client.js` - Cliente API REST

El módulo `taskAPI` es el encargado de toda la comunicación HTTP con el backend:

```javascript
const API_URL = 'http://localhost:3000/api/v1/tasks';

export const taskAPI = {
    isLoading: false,
    onLoadingChange: null,  // Callback para estado de carga
    onError: null,          // Callback para errores

    // Métodos CRUD asíncronos
    async getAll()    { ... }  // GET /api/v1/tasks
    async create()    { ... }  // POST /api/v1/tasks
    async update()    { ... }  // PUT /api/v1/tasks/:id
    async delete()    { ... }  // DELETE /api/v1/tasks/:id
};

```
## Backend - Explicación Técnica

### 1. Middlewares

Los middlewares son funciones que se ejecutan antes de llegar a las rutas, procesando las peticiones:

```javascript
// server/src/index.js

// 1️⃣ CORS - Permite comunicación cross-origin (frontend en diferente puerto)
app.use(cors());

// 2️⃣ JSON Parser - Convierte el body de las peticiones a objetos JavaScript
app.use(express.json());

// 3️⃣ Static Files - Sirve archivos estáticos del frontend
app.use(express.static(frontendPath));

// 4️⃣ Error Handler - Middleware de manejo de errores global
app.use((err, req, res, next) => {
    // Mapeo semántico de errores
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Recurso no encontrado' });
    }
    if (err.message === 'VALIDATION_ERROR') {
        return res.status(400).json({ error: 'Datos incorrectos' });
    }
    // Error genérico 500
    res.status(500).json({ error: 'Internal Server Error' });
});
```

### 2. Sistema de Rutas (Router)

El Router desacopla la definición de URLs de la lógica de negocio:

```javascript
// server/src/routes/task.routes.js
const router = express.Router();

// Cada ruta mapea a un método del controlador
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
```

### 3. Controladores (Controllers)

Los controladores manejan la lógica de request/response:

```javascript
// server/src/controllers/task.controller.js
const createTask = (req, res) => {
    const { title, priority, type } = req.body;
    
    // Validación básica
    if (!title || title.trim() === "") {
        return res.status(400).json({ error: 'El título es obligatorio' });
    }
    
    // Delegar lógica de negocio al service
    const nuevaTarea = taskService.crearTarea({ title, priority, type });
    res.status(201).json(nuevaTarea);
};
```

### 4. Servicios (Services)

Los servicios contienen la lógica de negocio pura:

```javascript
// server/src/services/task.service.js
const crearTarea = (data) => {
    const nuevaTarea = {
        id: Date.now().toString(),
        ...data,
        completed: false,
        createdAt: new Date()
    };
    tasks.push(nuevaTarea);
    return nuevaTarea;
};
```

---

## API REST

### Endpoints Disponibles

| Método | Endpoint | Descripción | Código de Éxito |
|--------|----------|-------------|-----------------|
| `GET` | `/api/v1/tasks` | Obtener todas las tareas | `200 OK` |
| `POST` | `/api/v1/tasks` | Crear nueva tarea | `201 Created` |
| `PUT` | `/api/v1/tasks/:id` | Actualizar tarea completa | `200 OK` |
| `DELETE` | `/api/v1/tasks/:id` | Eliminar tarea | `204 No Content` |

### Códigos de Estado HTTP

| Código | Significado | Cuándo se devuelve |
|--------|-------------|-------------------|
| `200 OK` | Éxito | GET y PUT completados correctamente |
| `201 Created` | Recurso creado | POST exitoso, tarea creada |
| `204 No Content` | Éxito sin contenido | DELETE exitoso |
| `400 Bad Request` | Datos inválidos | Validación fallida (ej: título vacío) |
| `404 Not Found` | Recurso no encontrado | Tarea con ID no existe |
| `500 Internal Server Error` | Error del servidor | Excepción no controlada |

### Ejemplos de Respuestas

#### ✅ GET /api/v1/tasks (200 OK)
```json
[
  {
    "id": "1696874523456",
    "title": "Comprar leche",
    "completed": false,
    "priority": "baja",
    "type": "personal",
    "createdAt": "2026-04-09T18:00:00.000Z"
  }
]
```

#### ✅ POST /api/v1/tasks (201 Created)
**Request:**
```json
{
  "title": "Reunión de equipo",
  "priority": "alta",
  "type": "trabajo"
}
```

**Response:**
```json
{
  "id": "1696874523789",
  "title": "Reunión de equipo",
  "completed": false,
  "priority": "alta",
  "type": "trabajo",
  "createdAt": "2026-04-09T18:05:00.000Z"
}
```

#### ❌ POST /api/v1/tasks (400 Bad Request)
**Request:**
```json
{ "priority": "alta", "type": "trabajo" }
```

**Response:**
```json
{
  "error": "El título es obligatorio"
}
```

#### ❌ DELETE /api/v1/tasks/:id (404 Not Found)
**Response:**
```json
{
  "error": "Recurso no encontrado",
  "message": "La tarea que intentas manipular no existe."
}
```

---

## Gestión de Estados de UI

### Arquitectura de Estados

La aplicación gestiona tres estados principales de la interfaz:

### 1. Estado LOADING (Cargando)

Cuando una operación de red está en progreso:

```javascript
// client.js - setLoading()
setLoading(loading) {
    this.isLoading = loading;
    if (this.onLoadingChange) {
        this.onLoadingChange(loading);  // Notifica a la app principal
    }
}
```
```javascript
// app.js - updateLoadingUI()
if (this.isLoading) {
    taskListContainer.innerHTML = `
        <li class="flex items-center justify-center p-12">
            <div class="flex flex-col items-center gap-4">
                <div class="w-12 h-12 border-4 border-purple-200 
                            border-t-purple-600 rounded-full animate-spin"></div>
                <p class="text-slate-500 font-semibold">Cargando tareas...</p>
            </div>
        </li>
    `;
}
```

### 2. Estado SUCCESS (Éxito)

Cuando una operación se completa correctamente:

- **Actualización inmediata del DOM** - Los datos se reflejan al instante
- **Recálculo de estadísticas** - El panel de progreso se actualiza
- **Feedback implícito** - El usuario ve el resultado de su acción

```javascript
// TaskController.js - addTask()
const createdTask = await taskAPI.create({...});
this.taskCollection.add(createdTask);  // Actualiza modelo
if (this.onTasksChange) this.onTasksChange();  // Re-renderiza UI
```

### 3. Estado ERROR (Fallo)

Cuando una operación falla (ej: servidor caído, datos inválidos):

- **Banner rojo en la parte superior** - Notificación visual clara
- **Mensaje descriptivo** - Explica qué salió mal
- **Auto-ocultable** - Desaparece después de 5 segundos
- **Posibilidad de reintentar** - El usuario puede volver a intentar

```javascript
// app.js - showError()
showError(message, error) {
    this.hasError = true;
    this.errorMessage = message;
    this.updateErrorUI();
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        this.hideError();
    }, 5000);
}

// app.js - updateErrorUI()
const banner = document.createElement('div');
banner.className = 'fixed top-4 right-4 z-[200] bg-red-500 text-white px-6 py-3 rounded-xl';
banner.innerHTML = `
    <span class="text-xl">⚠️</span>
    <div>
        <p class="font-bold">Error de conexión</p>
        <p class="text-sm opacity-90">${this.errorMessage}</p>
    </div>
    <button onclick="...">✕</button>
`;
document.body.appendChild(banner);
```

### Flujo Completo de Estados

```javascript
// Ejemplo: Crear tarea con gestión completa de estados

async addTask(taskData) {
    // 1. Validar datos
    const validation = validateNewTask(taskData);
    if (!validation.ok) return false;

    // 2. Activar estado LOADING
    this.setLoading(true);

    try {
        // 3. Petición a API
        const createdTask = await taskAPI.create({...});

        // 4. ÉXITO - Actualizar modelo y UI
        this.taskCollection.add(createdTask);
        if (this.onTasksChange) this.onTasksChange();
        return true;

    } catch (error) {
        // 5. ERROR - Notificar al usuario
        const errorMsg = error.message.includes('400') 
            ? 'El servidor indica que los datos son inválidos' 
            : 'Error de conexión con el servidor';
        
        if (this.onError) this.onError(errorMsg, error);
        return false;

    } finally {
        // 6. Siempre - Desactivar LOADING
        this.setLoading(false);
    }
}
```

---

## Ejemplos Prácticos

### Ejemplo 1: Petición GET (Obtener todas las tareas)

```javascript
// weekyCheck/js/api/client.js

async getAll() {
    this.setLoading(true);  // Activar spinner
    try {
        const response = await fetch(API_URL);  // GET http://localhost:3000/api/v1/tasks
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();  // Parsear JSON
        return data;  // Array de tareas
        
    } catch (error) {
        this.reportError('Error al cargar tareas', error);
        throw error;
    } finally {
        this.setLoading(false);  // Desactivar spinner
    }
}
```

### Ejemplo 2: Petición POST (Crear tarea)

```javascript
// weekyCheck/js/api/client.js

async create(taskData) {
    this.setLoading(true);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(taskData)  // Serializar objeto a JSON
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;  // Tarea creada con ID
        
    } catch (error) {
        this.reportError('Error al crear la tarea', error);
        throw error;
    } finally {
        this.setLoading(false);
    }
}
```

### Ejemplo 3: Uso desde el Controlador

```javascript
// weekyCheck/js/controllers/TaskController.js

async addTask(taskData) {
    const validation = validateNewTask(taskData);
    if (!validation.ok) return false;

    this.setLoading(true);

    try {
        // Llamar a la API
        const createdTask = await taskAPI.create({
            title: validation.value.title,
            completed: false,
            priority: validation.value.priority,
            type: validation.value.type,
        });

        // Actualizar colección local
        this.taskCollection.add({
            id: createdTask.id,
            title: createdTask.title,
            completed: createdTask.completed,
            priority: createdTask.priority,
            type: createdTask.type,
            createdAt: createdTask.createdAt,
        });

        // Notificar cambio para re-renderizar
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
```

### Ejemplo 4: Configuración de Callbacks en la App Principal

```javascript
// weekyCheck/js/app.js

setupAPICallbacks() {
    // Callback para estado de carga
    taskAPI.onLoadingChange = (loading) => {
        this.isLoading = loading;
        this.updateLoadingUI();  // Mostrar/ocultar spinner
    };
    
    // Callback para errores
    taskAPI.onError = (message, error) => {
        this.showError(message, error);  // Mostrar banner de error
    };
}
```

---

## Instalación y Ejecución

### Prerrequisitos

- **Node.js** >= 14.0.0
- **npm** o **yarn**

### Pasos de Instalación

#### 1. Clonar el repositorio

```bash
git clone https://github.com/nataliagalanalv/taskflow-project.git
cd taskflow-project
```

#### 2. Instalar dependencias del Backend

```bash
cd server
npm install
```

#### 3. Configurar variables de entorno (opcional)

```bash
# Crear archivo .env en server/
echo "PORT=3000" > server/.env
```

#### 4. Iniciar el Backend

```bash
# En la carpeta server/
npm run dev    # Con nodemon (auto-reload)
# o
npm start      # Sin auto-reload
```

El servidor estará disponible en: `http://localhost:3000`

#### 5. Iniciar el Frontend

**Opción A: Servidor de desarrollo integrado**

El backend ya sirve los archivos estáticos del frontend. Simplemente abre:
```
http://localhost:3000
```

**Opción B: Servidor de desarrollo separado (opcional)**

```bash
# En la carpeta weekyCheck/ (si se configura un servidor de desarrollo)
npx serve .
```

---

## Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **HTML5** | - | Estructura semántica |
| **CSS3** | - | Estilos y diseño |
| **JavaScript** | ES6+ | Lógica de aplicación |
| **Tailwind CSS** | CDN | Framework CSS utilitario |
| **Fetch API** | Nativo | Comunicación HTTP |

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | >= 14.0.0 | Entorno de ejecución |
| **Express** | ^5.2.1 | Framework web |
| **CORS** | ^2.8.6 | Middleware cross-origin |
| **dotenv** | ^17.4.1 | Variables de entorno |
| **nodemon** | ^3.1.14 | Auto-reload en desarrollo |

---

## Licencia

Este proyecto está bajo la licencia MIT.

---

<div align="center">

**Hecho con ❤️ por [Natalia Galán](https://github.com/nataliagalanalv)**

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

</div>