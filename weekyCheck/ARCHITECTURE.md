# WeekyCheck - Arquitectura del Proyecto

## Estructura de Carpetas

```
weekyCheck/
├── index.html              # Página principal
├── ARCHITECTURE.md         # Este archivo
├── README.md               # Documentación del proyecto
│
├── css/                    # Estilos CSS separados
│   ├── main.css           # Estilos base, layout y variables CSS
│   └── components.css     # Estilos específicos de componentes
│
├── js/                     # Código JavaScript modular
│   ├── app.js             # Punto de entrada principal (orquestador)
│   │
│   ├── models/            # Modelos de datos
│   │   └── Task.js        # Modelo Task y TaskCollection
│   │
│   ├── services/          # Servicios (persistencia, temas, etc.)
│   │   ├── StorageService.js  # Persistencia en localStorage
│   │   └── ThemeService.js    # Gestión del tema claro/oscuro
│   │
│   ├── components/        # Componentes UI reutilizables
│   │   ├── TaskList.js    # Componente lista de tareas
│   │   ├── TaskItem.js    # Componente item individual de tarea
│   │   ├── StatsPanel.js  # Panel de estadísticas
│   │   └── FilterBar.js   # Barra de filtros y búsqueda
│   │
│   ├── controllers/       # Controladores (lógica de negocio)
│   │   └── TaskController.js  # Controlador de operaciones de tareas
│   │
│   └── utils/             # Utilidades y constantes
│       ├── validations.js # Funciones de validación
│       └── constants.js   # Constantes de la aplicación
│
└── assets/                # Recursos estáticos
    ├── fonts/             # Fuentes tipográficas
    │   └── pangolinregular.ttf
    └── icons/             # Iconos SVG
        └── icons.svg
```

## Patrón de Diseño: MVC Mejorado

### Model (Modelo)
- **`models/Task.js`**: Define la estructura de datos de una tarea y la colección de tareas
- Maneja el estado interno y las operaciones básicas (toggle, update, etc.)

### View (Vista)
- **`components/`**: Componentes UI que se encargan del renderizado
- **`css/`**: Estilos separados en main.css (base) y components.css (específicos)

### Controller (Controlador)
- **`controllers/TaskController.js`**: Maneja la lógica de negocio y las operaciones CRUD
- **`services/ThemeService.js`**: Controla la lógica del tema

### Services (Servicios)
- **`services/StorageService.js`**: Abstrae la persistencia en localStorage
- **`services/ThemeService.js`**: Gestiona el tema de la aplicación

## Flujo de Datos

1. **Inicio de la aplicación** (`app.js`):
   - Carga tareas desde localStorage
   - Inicializa servicios y componentes
   - Renderiza la UI inicial

2. **Interacción del usuario**:
   - Los eventos se capturan en los componentes
   - Los controladores procesan las acciones
   - El modelo se actualiza
   - Los componentes se re-renderizan

3. **Persistencia**:
   - Cada cambio en el modelo se guarda automáticamente en localStorage
   - El tema se guarda independientemente

## Separation of Concerns (SoC)

### ✅ Beneficios de esta arquitectura:

1. **Mantenibilidad**: Cada módulo tiene una única responsabilidad clara
2. **Testeabilidad**: Fácil de testear unidades individuales
3. **Escalabilidad**: Nuevas características se agregan sin romper código existente
4. **Reutilización**: Componentes UI independientes y reutilizables
5. **Colaboración**: Múltiples desarrolladores pueden trabajar en áreas separadas
6. **Legibilidad**: Código organizado y fácil de entender

## Migración desde la versión anterior

La aplicación mantiene **100% de la funcionalidad y estética original**. Los cambios son únicamente internos:

- ✅ Mismas funcionalidades (CRUD de tareas, filtros, tema oscuro)
- ✅ Misma interfaz de usuario
- ✅ Misma experiencia de usuario
- ✅ Mismos datos persistentes (compatible con localStorage existente)

## Próximas Mejoras Potenciales

1. Agregar tests unitarios para cada módulo
2. Implementar un sistema de notificaciones
3. Agregar más opciones de filtrado
4. Implementar categorías personalizadas
5. Agregar fechas de vencimiento
6. Exportar/importar tareas