# \*\* INGENIERIA DE PROMPTS \*\*



Repositorio de los prompts más efectivos utilizados en el proyecto. Aquí se incluyen las instrucciones de sistema y plantillas de prompts que han permitido obtener respuestas precisas y código funcional para el proyecto.



## 1\. Definición de Rol (Role Prompting)



Por qué funciona: Al darle una identidad, la IA ajusta su vocabulario, prioriza la eficiencia y evita explicaciones obvias.



##### Prompt 1 (Arquitecto Senior):



"*@filesystem Actúa como un Desarrollador Senior Full Stack. Revisa la estructura de carpetas de TaskFlow y dime si cumple con las buenas prácticas de separación de conceptos (Separation of Concerns). Si ves algo mejorable, propón una estructura más profesional.*"



Cline reorganiza completamente la estructura del proyecto aplicando Separation of Concerns (SoC) y patrones profesionales de desarrollo Full Stack. Se guarda dicha configuración y se comprueba que el programa mantiene su lógica y estética. La nueva estructura permite tests unitarios, colaboración en equipo, mantenimiento a largo plazo y posible migración a frameworks (React, Vue, etc.)





##### Prompt 2 (Experto en QA/Testing):



"*@filesystem Actúa como un Ingeniero de QA experto en seguridad. Analiza app.js buscando posibles vulnerabilidades, como inyecciones de script en los inputs de las tareas, y dime cómo proteger el código.*"



Resumen del análisis por CLine:



\_\_Nivel de seguridad actual: 7/10\_\_



\- ✅ \_\_Protección XSS en renderizado\_\_: EXCELENTE

\- ⚠️ \_\_Validación de entrada\_\_: BUENA pero mejorable

\- ⚠️ \_\_Persistencia\_\_: NECESITA MEJORAS

\- ✅ \_\_Búsqueda\_\_: SEGURO



La aplicación está bien protegida contra XSS reflejado, pero necesita reforzar la validación de datos persistentes y añadir límites de longitud.





## 2\. Razonamiento Paso a Paso (Chain of Thought)



Por qué funciona: Obliga a la IA a "pensar" antes de escribir código. Esto reduce errores lógicos que aplicaría en el código.



##### Prompt 3 (Depuración Lógica):



"*@filesystem Quiero implementar un sistema de edición de tareas. Antes de escribir el código, explica paso a paso la lógica necesaria: desde cómo capturar el clic hasta cómo actualizar el array en memoria y refrescar el DOM.*"



Cline describe el paso a paso de cómo funciona el flujo de nuestro guardado de tareas y posibles mejoras





##### Prompt 4 (Planificación de Refactorización):



"*@filesystem Analiza la función de guardado en db.js. Explica paso a paso cómo podrías convertirla de síncrona a asíncrona usando promesas para que no bloquee la interfaz.*"



De nuevo Cline facilita la explicación del paso a paso, ayudándose de diagramas, y añadiendo resumen y opciones de mejoras:



Resumen Final:



\_\_Para tu aplicación actual (localStorage):\_\_



1\. ✅ Mantén `saveTasks()` síncrono para compatibilidad

2\. ✅ Agrega `saveTasksAsync()` con promesas

3\. ✅ Usa `debounce()` para optimizar múltiples cambios

4\. ✅ Añade indicadores visuales de guardado

5\. ✅ Implementa manejo robusto de errores



\_\_Para el futuro (si creces):\_\_



\- Migrar a IndexedDB para datos grandes

\- Usar Web Workers para procesamiento pesado

\- Implementar sync con backend si es necesario





## 3\. Con Ejemplos (Few-Shot Prompting)



Por qué funciona: La IA da mejores resultados si en el prompt ya incluyes ejemplos al que poder adaptar su respuesta. Si le das un ejemplo del estilo que quieres, lo imitará perfectamente.



##### Prompt 5 (Estilo de Código):



"*@filesystem Quiero documentar mis funciones. Usa este estilo: \[Ejemplo: /\*\* @param {type} name - desc \*/]. Basándote en ese formato, documenta todas las funciones de validations.js.*"





##### Prompt 6 (Creación de Componentes):



"*En TaskFlow usamos botones con clases de Tailwind así: <button class="px-4 py-2 bg-blue-500 text-white rounded">. Siguiendo ese mismo estilo visual, genera el HTML para un modal de confirmación de borrado*."







## 4\. Con Restricciones Claras (Negative/Constraint Prompting)



Por qué funciona: Evita que la IA use librerías que no quieres, métodos anticuados y la orientas a la lógica o estilo tuyo propio para que sea acorde con el resto del proyecto. 





##### Prompt 7 (Restricción de Librerías):



"*@filesystem Refactoriza el manejo de eventos en app.js. RESTRICCIÓN: No uses jQuery, utiliza exclusivamente Vanilla JS y asegúrate de no usar var, solo let y const.*"



Cline genera código y factoriza todo el proyecto con el prompt y restricción indicada. En este caso no se aplica en nuestro proyecto





##### Prompt 8 (Optimización de Rendimiento):



"*@filesystem Optimiza el bucle que renderiza las tareas. RESTRICCIÓN: No uses innerHTML dentro del bucle por razones de seguridad y rendimiento; usa document.createElement y appendChild.*"







## 5\. Generación y Documentación (Combinados)



##### Prompt 9 (Generación Completa):



"*@filesystem Basándote en index.html, genera un archivo styles.css que use variables CSS para el esquema de colores. El código debe estar limpio y no debe tener estilos duplicados.*"



Al usar el servidor MCP (@filesystem), Cline no inventa nombres de clases al azar. Lee el HTML del proyecto, identifica las clases que ya existen y genera un CSS que encaja. 





##### Prompt 10 (Manual de Usuario):



"*@filesystem Lee todo el proyecto y actúa como un Redactor Técnico. Genera un archivo USER\_GUIDE.md que explique a un usuario final cómo añadir, priorizar y borrar tareas en TaskFlow*."



Cline cambia su lenguaje para adaptarlo del rol de programador a usuario . Al tener acceso a todos los archivos, explica exactamente qué botones debe pulsar el usuario porque sabe cómo se llaman (id, class) y qué hacen las funciones asociadas.





