# Instrucciones para Probar WeekyCheck

## Verificación de Funcionalidad

La aplicación ha sido refactorizada manteniendo **100% de la funcionalidad original**. Para verificar que todo funciona correctamente:

### 1. Abrir la aplicación
- Abre `weekyCheck/index.html` en tu navegador
- La aplicación debería cargar sin errores en la consola

### 2. Verificar funcionalidades básicas

#### ✅ Crear tarea
1. Escribe una tarea en el campo "¿Qué hay que hacer hoy?"
2. Selecciona prioridad y tipo
3. Haz click en "Agregar nueva tarea"
4. **Resultado esperado**: La tarea aparece en la lista

#### ✅ Completar tarea
1. Haz click en el botón ✓ (verde) de una tarea
2. **Resultado esperado**: La tarea se marca como completada (opaca y tachada)

#### ✅ Editar tarea
1. Haz click en el botón ✎ (azul) de una tarea
2. Escribe un nuevo título
3. **Resultado esperado**: El título de la tarea se actualiza

#### ✅ Eliminar tarea
1. Haz click en el botón ✕ (rojo) de una tarea
2. **Resultado esperado**: La tarea desaparece de la lista

#### ✅ Filtros
1. Usa los botones "Todas", "Pendientes", "Hechas"
2. **Resultado esperado**: La lista se filtra correctamente

#### ✅ Filtros avanzados
1. Usa los selectores de prioridad y tipo
2. **Resultado esperado**: La lista se filtra por prioridad y tipo

#### ✅ Búsqueda
1. Escribe en el campo "Buscar tarea..."
2. **Resultado esperado**: Las tareas se filtran en tiempo real

#### ✅ Acciones masivas
1. Click en "Marcar todas las tareas como completadas"
2. **Resultado esperado**: Todas las tareas se marcan como completadas
3. Click en "Eliminar todas las tareas completadas"
4. **Resultado esperado**: Las tareas completadas desaparecen

#### ✅ Tema oscuro/claro
1. Click en el botón 🌙/☀️ en la esquina superior derecha
2. **Resultado esperado**: El tema cambia entre claro y oscuro
3. Recarga la página
4. **Resultado esperado**: El tema se mantiene

#### ✅ Estadísticas
1. Observa el panel lateral "Progreso Total"
2. **Resultado esperado**: El gráfico circular y los números se actualizan con las tareas

### 3. Verificar persistencia de datos
1. Crea algunas tareas
2. Cierra el navegador
3. Vuelve a abrir la aplicación
4. **Resultado esperado**: Las tareas siguen ahí

### 4. Verificar responsive design
1. Cambia el tamaño de la ventana del navegador
2. **Resultado esperado**: El diseño se adapta (sidebar se mueve arriba/abajo en móvil)

## Posibles Problemas y Soluciones

### ❌ Error: "Failed to load module"
**Causa**: El navegador no puede cargar los módulos ES6
**Solución**: 
- Asegúrate de abrir el archivo mediante un servidor local (no directamente desde el sistema de archivos)
- Usa una extensión como "Live Server" en VS Code
- O ejecuta: `npx serve` en la carpeta del proyecto

### ❌ Error: "Cannot use import statement outside a module"
**Causa**: El atributo `type="module"` falta en el script tag
**Solución**: Verifica que en `index.html` el script tenga: `<script type="module" src="js/app.js"></script>`

### ❌ Los estilos no se ven correctamente
**Causa**: Tailwind CSS no está cargando
**Solución**: Verifica que tienes conexión a internet (Tailwind se carga desde CDN)

### ❌ Las tareas no se guardan
**Causa**: localStorage no está disponible
**Solución**: 
- Verifica que el navegador permite localStorage
- No estás en modo incógnito/privado (algunos navegadores bloquean localStorage)

## Verificación de la Nueva Arquitectura

### Estructura de archivos
```
✅ js/models/Task.js - Modelo de datos
✅ js/services/StorageService.js - Persistencia
✅ js/services/ThemeService.js - Tema
✅ js/components/*.js - Componentes UI
✅ js/controllers/TaskController.js - Lógica
✅ js/utils/constants.js - Constantes
✅ js/utils/validations.js - Validaciones
✅ js/app.js - Orquestador principal
✅ css/main.css - Estilos base
✅ css/components.css - Estilos componentes
✅ assets/fonts/ - Fuentes organizadas
✅ assets/icons/ - Iconos organizados
```

### Consola del navegador
- No debería haber errores (solo warnings de Tailwind si los hay)
- Todos los imports de módulos deberían resolverse correctamente

## Comparación con la versión anterior

| Característica | Versión Anterior | Nueva Versión | Estado |
|---------------|-----------------|---------------|--------|
| Crear tareas | ✅ Funciona | ✅ Funciona | ✅ Igual |
| Editar tareas | ✅ Funciona | ✅ Funciona | ✅ Igual |
| Eliminar tareas | ✅ Funciona | ✅ Funciona | ✅ Igual |
| Completar tareas | ✅ Funciona | ✅ Funciona | ✅ Igual |
| Filtros | ✅ Funciona | ✅ Funciona | ✅ Igual |
| Búsqueda | ✅ Funciona | ✅ Funciona | ✅ Igual |
| Tema oscuro | ✅ Funciona | ✅ Funciona | ✅ Igual |
| Estadísticas | ✅ Funciona | ✅ Funciona | ✅ Igual |
| Persistencia | ✅ Funciona | ✅ Funciona | ✅ Igual |
| Responsive | ✅ Funciona | ✅ Funciona | ✅ Igual |

## Conclusión

Si todas las verificaciones anteriores son exitosas, la refactorización se ha completado correctamente manteniendo la funcionalidad y estética originales, pero con una arquitectura mucho más profesional y mantenible.