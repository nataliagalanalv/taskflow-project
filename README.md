# ⚡ WeekyCheck - Task Management Dashboard

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![LocalStorage](https://img.shields.io/badge/LocalStorage-FF6B35?style=for-the-badge&logo=html5&logoColor=white)

**Una app de gestión de tareas con estética Psicodélica/Neón y enfoque en productividad.**

</div>

---

## 📸 Vista Previa

<!-- INSERT SCREENSHOT HERE -->
![WeekyCheck Interface](./assets/screenshot.png "Interfaz Neón de WeekyCheck")

---

## ✨ Funcionalidades Clave

- **🔍 Búsqueda Inteligente** - Encuentra tareas al instante con nuestro sistema de búsqueda en tiempo real.
- **🏷️ Filtros y Categorías** - Organiza y visualiza tareas por estado (pendientes/completadas) y categorías personalizadas.
- **✏️ Edición Rápida** - Modifica el título, descripción y estado de tus tareas con un solo clic.
- **🎯 Modo Enfoque con Pomodoro** - Selecciona una tarea y activa el temporizador Pomodoro para maximizar tu productividad con sesiones de 25 minutos.

---

## 🛠️ Stack Tecnológico

| Tecnología | Descripción |
|------------|-------------|
| **HTML5** | Estructura semántica y accesible |
| **Tailwind CSS** | Estilizado utility-first para una interfaz neón responsiva |
| **JavaScript Vanilla (ES6+)** | Lógica de aplicación moderna sin dependencias externas |
| **LocalStorage** | Persistencia de datos en el navegador sin necesidad de backend |

---

## 🚀 Instalación

Sigue estos pasos simples para ejecutar WeekyCheck en tu máquina local:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/nataliagalanalv/taskflow-project.git
   ```

2. **Navega al directorio del proyecto:**
   ```bash
   cd taskflow-project/weekyCheck
   ```

3. **Abre el archivo `index.html` en tu navegador:**
   - Simplemente haz doble clic en `index.html`, o
   - Usa una extensión de Live Server en VS Code para una mejor experiencia de desarrollo.

¡Y eso es todo! No se requiere instalación de dependencias ni configuración adicional.

---

## 📖 Uso

### Gestión de Tareas

1. **Agregar Tarea:** Usa el formulario en la parte superior para crear nuevas tareas con título, descripción y categoría.
2. **Buscar Tareas:** Escribe en la barra de búsqueda para filtrar tareas por nombre o descripción.
3. **Filtrar por Estado:** Usa los botones de filtro para ver tareas pendientes, completadas o todas.

### Ejemplos de Uso

#### 💡 Ejemplo 1: Crear y Organizar Tareas Diarias
```
1. Abre WeekyCheck en tu navegador
2. En el formulario de nueva tarea, completa:
   - Título: "Revisar correos electrónicos"
   - Descripción: "Responder emails pendientes del equipo"
   - Categoría: "Trabajo"
3. Haz clic en "Agregar Tarea"
4. Repite el proceso para crear más tareas como:
   - "Reunión de equipo" (Categoría: Reuniones)
   - "Actualizar documentación" (Categoría: Trabajo)
   - "Comprar groceries" (Categoría: Personal)
```

#### 🔍 Ejemplo 2: Búsqueda y Filtrado
```
# Buscar tareas específicas:
- Escribe "correos" en la barra de búsqueda → Filtra tareas que contienen esa palabra
- Escribe "reunión" → Muestra solo tareas relacionadas con reuniones

# Filtrar por estado:
- Clic en "Pendientes" → Muestra solo tareas sin completar
- Clic en "Completadas" → Muestra el historial de tareas terminadas
- Clic en "Todas" → Vuelve a mostrar todo el listado
```

#### ✏️ Ejemplo 3: Editar una Tarea Existente
```
1. Localiza la tarea "Actualizar documentación" en tu lista
2. Haz clic en el icono de lápiz/editar junto a la tarea
3. Modifica el título a: "Actualizar documentación del API"
4. Agrega más detalles en la descripción si es necesario
5. Guarda los cambios
```

#### 🎯 Ejemplo 4: Sesión de Enfoque con Pomodoro
```
# Preparar una sesión de productividad:
1. Revisa tu lista de tareas pendientes
2. Selecciona la tarea más importante: "Revisar correos electrónicos"
3. Haz clic en el botón de "Enfoque" (icono de objetivo)
4. El temporizador Pomodoro se activará automáticamente (25 min)
5. Trabaja exclusivamente en esa tarea hasta que suene la alarma
6. Cuando termine el temporizador:
   - Marca la tarea como completada si la terminaste
   - Toma un descanso de 5 minutos
   - Inicia otra sesión con una nueva tarea
```

#### 🏷️ Ejemplo 5: Flujo de Trabajo por Categorías
```
# Organizar tu semana con categorías:
Lunes - Categoría "Trabajo":
  - Filtra por categoría "Trabajo"
  - Enfócate solo en tareas laborales
  - Usa el Modo Enfoque para tareas complejas

Viernes - Categoría "Personal":
  - Filtra por categoría "Personal"
  - Revisa tareas personales pendientes
  - Planifica el fin de semana
```

### 🎯 Modo Enfoque (Focus Mode)

El Modo Enfoque está diseñado para ayudarte a mantener la concentración en una sola tarea a la vez usando la técnica Pomodoro.

**Cómo usar el Modo Enfoque:**

1. **Selecciona una tarea** de tu lista haciendo clic en ella.
2. **Activa el Modo Enfoque** haciendo clic en el botón de "Enfoque" o el icono de objetivo.
3. **Inicia el temporizador Pomodoro** (25 minutos por defecto).
4. **Trabaja sin distracciones** hasta que suene la alarma.
5. **Toma un descanso** de 5 minutos entre sesiones.

El temporizador muestra el tiempo restante y te permite pausar, reanudar o reiniciar la sesión según necesites.

---

## 📁 Estructura del Proyecto

```
taskflow-project/
├── weekyCheck/
│   ├── index.html          # Página principal
│   ├── css/                # Estilos personalizados (si los hay)
│   ├── js/
│   │   ├── app.js          # Punto de entrada principal
│   │   ├── components/     # Componentes de la UI
│   │   │   ├── TaskList.js
│   │   │   ├── TaskItem.js
│   │   │   ├── FilterBar.js
│   │   │   ├── FocusMode.js
│   │   │   └── Timer.js
│   │   └── services/
│   │       └── StorageService.js  # Gestión de LocalStorage
│   └── assets/             # Recursos multimedia (imágenes, iconos)
└── README.md
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Hecho con ⚡ y código limpio**

---

</div>