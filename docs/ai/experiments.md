# \*\* EXPERIMENTOS CON IA \*\*





## Bloque 1. Problemas de lógica pura





El código generado para estos tests se localiza en docs/ai/logic-tests, tanto el creado manualmente como el generado por la IA además de su explicación a porqué sus métodos son más óptimos. En este documento no se incluirá código. 





##### Experimento 1: El Validador de Palíndromos



* Tiempo Manual: 10 minutos



* Tiempo con IA: 10 segundos



* Calidad y comprensión del código: La IA usó métodos que conocía pero no con la lógica que yo hubiera pensado. Además sugiere dos opciones, facilitando explicación de por que la segunda es mejor, se trata de una implementación con dos punteros sólo, lo que genera una rápida respuesta y no requiere tanto uso de memoria.





##### Experimento 2: El Reto FizzBuzz



* Tiempo Manual: 20 minutos



* Tiempo con IA: 15 segundos



* Calidad y comprensión del código: La IA vuelve a ofrecer varias opciones. En este caso un método sencillo como el que he generado de pocas líneas, la IA ha facilitado una lógica de código mucho más compleja que permitiría, a la larga, añadir nuevas reglas y comprobaciones de forma mucho más sencilla que si hubiera que modificar mi código original. Para mi gusto, en caso de tener que ser escalable la función si estaría bien la sugerencia de código de la IA, pero en esta ocasión por simplicidad y código me quedaría con mi función. 





##### Experimento 3: Contador de Caracteres



* Tiempo Manual: 25 minutos



* Tiempo con IA: 20 segundos



* Calidad y comprensión del código: De nuevo la IA genera un código mucho más complejo de lo solicitado. No se limita a crear un contador sino a poner validadores adicionales para, como en el anterior experimento, orientar el código a una posible escalabilidad y fácil adaptación a inclusión de nuevas normas o excepciones. En esta ocasión ha usada una función que conocía pero no había visto aplicada: pipe(). Con el uso de pipe y generando un Map el problema se expande y se pueden obtener muchas más opciones que sólo contar los caracteres, incluso incluye el filtrado de los resultados. 







## Bloque 2. Problemas dentro del proyecto WeekyCheck





##### Tarea 1: Refactorización del Filtrado (Componentes)



* Objetivo: Hacer que el selector de prioridad funcione de verdad para filtrar la lista



* Tiempo manual: 30 minutos



* Tiempo con IA: 35 segundos



* Calidad y comprensión del código: La lógica de la app ahora funciona de forma reactiva: cuando el usuario cambia la prioridad en FilterBar, se emite un evento personalizado que TaskList escucha para volver a renderizarse sin necesidad de recargar la página. Desde el archivo app.js se establece la referencia cruzada y vincula los eventos reactivos.





##### Tarea 2: Robustez del Almacenamiento (Servicios)



* Objetivo: Mejorar el guardado de datos para que no se corrompan y manejar errores.



* Tiempo manual: 20 minutos



* Tiempo con IA: 30 segundos



* Calidad y comprensión del código: Todas las operaciones (loadTasks, saveTasks, loadTheme, saveTheme, clearTasks, clearAll, getStorageStats) ahora están envueltas en bloques try/catch. Los errores se registran con console.error para debugging y en caso de error crítico, se limpia el storage para evitar corrupción de datos





##### Tarea 3: Utilidades de Fecha y Tiempo (Utils)



* Objetivo: Mostrar hace cuánto se creó la tarea 



* Tiempo manual: 25 minutos



* Tiempo con IA: 30 segundos



* Calidad y comprensión del código: Sin usar librerías externas, Cline ha usado API nativa de JavaScript y ha creado un nuevo archivo que soporta múltiples formatos de entrada: timestamp en milisegundos, string ISO, o objeto Date. Incluye validación de fechas y manejo de errores

























