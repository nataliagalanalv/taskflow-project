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



Objetivo: Hacer que el selector de prioridad funcione de verdad para filtrar la lista.



Ubicación: js/components/FilterBar.js y js/components/TaskList.js.



Sin IA (Manual): Intenta escribir una función sencilla que recorra el array de tareas y oculte los elementos del DOM que no coincidan con la prioridad seleccionada.



Con IA (Cline + MCP): > Prompt: "@filesystem Actúa como un Desarrollador Senior. Refactoriza FilterBar.js para que emita un evento personalizado cuando cambie la prioridad. Luego, modifica TaskList.js para que escuche ese evento y filtre las tareas de forma reactiva sin recargar la página."



Qué comparar: Fíjate en cómo la IA maneja la "comunicación entre componentes", algo que suele ser difícil de hacer a mano limpiamente.





// Versión Manual Simple

const filtroPrioridad = document.getElementById('priority-filter');



filtroPrioridad.addEventListener('change', () => {

&#x20;   const valor = filtroPrioridad.value;

&#x20;   const tareas = document.querySelectorAll('.task-item');



&#x20;   tareas.forEach(tarea => {

&#x20;       if (valor === 'all') {

&#x20;           tarea.style.display = 'block';

&#x20;       } else {

&#x20;           // Comprobamos si el texto de la tarea contiene la prioridad

&#x20;           if (tarea.innerText.toLowerCase().includes(valor)) {

&#x20;               tarea.style.display = 'block';

&#x20;           } else {

&#x20;               tarea.style.display = 'none';

&#x20;           }

&#x20;       }

&#x20;   });

});









##### Tarea 2: Robustez del Almacenamiento (Servicios)



Objetivo: Mejorar el guardado de datos para que no se corrompan y manejar errores.



Ubicación: js/services/StorageService.js.



Sin IA (Manual): Escribe un localStorage.setItem() y getItem() básico.



Con IA (Cline + MCP):



Prompt: "@filesystem Revisa StorageService.js. Implementa un sistema de persistencia robusto que incluya: 1. Manejo de errores con try/catch. 2. Validación de datos antes de guardar. 3. Una función para limpiar todas las tareas. Explica por qué es importante validar los datos al leer de LocalStorage."



Qué comparar: La diferencia entre un código que "funciona" y un código "a prueba de fallos" (production-ready).





// Versión Manual Simple

const StorageService = {

&#x20;   saveTasks: (tasks) => {

&#x20;       localStorage.setItem('tasks', JSON.stringify(tasks));

&#x20;   },



&#x20;   getTasks: () => {

&#x20;       const data = localStorage.getItem('tasks');

&#x20;       return data ? JSON.parse(data) : \[];

&#x20;   },



&#x20;   clear: () => {

&#x20;       localStorage.removeItem('tasks');

&#x20;   }

};



export default StorageService;





##### Tarea 3: Utilidades de Fecha y Tiempo (Utils)



Objetivo: Mostrar hace cuánto se creó la tarea (ej: "hace 5 min").



Ubicación: Crear js/utils/dateFormatter.js.



Sin IA (Manual): Intenta restar la fecha actual de la fecha de creación y mostrar los minutos.



Con IA (Cline + MCP):



Prompt: "@filesystem Crea un nuevo archivo en js/utils/dateFormatter.js. Necesito una función que reciba un timestamp y devuelva una cadena relativa (ej: 'justo ahora', 'hace 2 horas', 'ayer'). No uses librerías externas como Moment.js, usa la API nativa Intl.RelativeTimeFormat de JavaScript."



Qué comparar: Verás cómo la IA conoce APIs modernas de JavaScript que nosotros a veces olvidamos que existen.





// Versión Manual Simple

function formatRelativeTime(fechaIso) {

&#x20;   const ahora = new Date();

&#x20;   const creacion = new Date(fechaIso);

&#x20;   const diferenciaMs = ahora - creacion;

&#x20;   

&#x20;   const minutos = Math.floor(diferenciaMs / 60000);

&#x20;   const horas = Math.floor(minutos / 60);



&#x20;   if (minutos < 1) return "Justo ahora";

&#x20;   if (minutos < 60) return `Hace ${minutos} min`;

&#x20;   if (horas < 24) return `Hace ${horas} horas`;

&#x20;   

&#x20;   return creacion.toLocaleDateString();

}



export default formatRelativeTime;







