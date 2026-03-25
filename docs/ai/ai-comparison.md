# **# COMPARATIVA DE MODELOS DE IA**



En este documento desarrollaremos las principales diferencias que se encuentran en el uso de dos modelos de IA durante el desarrollo de nuestro proyecto. El objetivo será determinar qué modelo (Claude o ChatGPT) ofrece mejores resultados para tareas específicas del proyecto.



## \## 1. Metodología de la Prueba



\*   Modelos usados: GPT-5.3 y Claude 4.6 Sonnet

\*   Fecha: 25.03.2026

\*   Temas técnicos: Closures, Event Loop, Hoisting.



## \## 2. Prueba teórica



##### Prompt empleado en ambos

"*Explícame de forma técnica pero sencilla qué son los Closures, el Event Loop y el Hoisting en JavaScript. Incluye un ejemplo de código corto para cada uno.*"



##### Resumen análisis test 1:

* \*\*ChatGPT\*\* | Las explicaciones son mucho más concisas y se ayuda de iconos como apoyo visual. 
* \*\*Claude\*\* | Las explicaciones son más concretas y se ayuda de diagramas en su explicación. En un lenguaje más serio y académico.
* \*\*Similitudes\*\* | Ambos proporcionan ejemplos muy similares e incluyen resumen rápido dónde sintetizan la idea de cada elemento en una sóla línea. 



###### 

###### **=====Respuesta ChatGPT=====**



🔒 Closures (Clausuras)

🧠 Idea clave



Un closure es cuando una función recuerda las variables de su entorno externo, incluso después de que ese entorno haya terminado de ejecutarse.



👉 En términos técnicos:

Una función mantiene una referencia al scope léxico en el que fue creada.



📦 Ejemplo

function crearContador() {

&#x20; let contador = 0;



&#x20; return function() {

&#x20;   contador++;

&#x20;   return contador;

&#x20; };

}



const contar = crearContador();



console.log(contar()); // 1

console.log(contar()); // 2

console.log(contar()); // 3



🔍 Qué pasa aquí

crearContador() termina de ejecutarse

Pero la función interna sigue teniendo acceso a contador

Eso es un closure



🔄 Event Loop

🧠 Idea clave



JavaScript es single-threaded, pero maneja operaciones asíncronas gracias al Event Loop, que coordina:



Call Stack (pila de ejecución)

Web APIs (setTimeout, fetch, etc.)

Callback Queue / Task Queue

Microtask Queue (promesas)



👉 El Event Loop decide cuándo ejecutar callbacks.



📦 Ejemplo

console.log("Inicio");



setTimeout(() => {

&#x20; console.log("Timeout");

}, 0);



Promise.resolve().then(() => {

&#x20; console.log("Promesa");

});



console.log("Fin");



🧾 Salida

Inicio

Fin

Promesa

Timeout



🔍 Por qué ocurre

Código síncrono → Inicio, Fin

Promesas → Microtask Queue (prioridad alta)

setTimeout → Task Queue (prioridad baja)



👉 El Event Loop ejecuta primero las microtasks.



📌 Hoisting

🧠 Idea clave



El hoisting es el comportamiento por el cual las declaraciones se "elevan" al inicio de su scope durante la fase de compilación.



⚠️ Pero solo se elevan las declaraciones, no las inicializaciones.



📦 Ejemplo con var

console.log(a); // undefined

var a = 10;

🔍 Equivalente real

var a;

console.log(a); // undefined

a = 10;

📦 Ejemplo con let y const

console.log(b); // ReferenceError

let b = 20;

🔍 Por qué falla

let y const también se hoistean

Pero quedan en la Temporal Dead Zone (TDZ) hasta su inicialización

📦 Ejemplo con funciones

saludar();



function saludar() {

&#x20; console.log("Hola");

}



✔️ Funciona porque las function declarations se hoistean completamente



🧩 Resumen rápido

Concepto	Qué hace

Closures	Mantienen acceso a variables externas

Event Loop	Gestiona asincronía en JS

Hoisting	Mueve declaraciones al inicio del scope



###### **=====Respuesta Claude=====**



Hoisting

El motor de JavaScript hace dos pasadas sobre el código antes de ejecutarlo: primero declara variables y funciones, luego las ejecuta. Esto hace que parezca que ciertas declaraciones "suben" al inicio del ámbito.



// Funciona: las funciones declaradas suben completas

greet(); // → "hola"



// Existe pero vale undefined: var sube la declaración, no el valor

console.log(x); // → undefined

var x = 5;



function greet() {

&#x20; console.log("hola");

}



⚠️ let y const también se elevan, pero no se inicializan — acceder a ellas antes de su declaración lanza un ReferenceError (zona muerta temporal).





Closures

Una función "recuerda" las variables del ámbito donde fue creada, aunque ese ámbito ya haya terminado de ejecutarse.

&#x20; crearContador() {

&#x20; let count = 0;



&#x20; return function () {

&#x20;   count++;

&#x20;   return count;

&#x20; };

}



const sumar = crearContador();



sumar(); // → 1

sumar(); // → 2

sumar(); // → 3



La variable count vive "atrapada" dentro del closure. Cada llamada a sumar() la recuerda y la modifica — aunque crearContador ya terminó su ejecución.





Event Loop

JavaScript es single-threaded: solo puede ejecutar una cosa a la vez. El Event Loop coordina la cola de tareas asíncronas (callbacks, promesas) con el hilo principal.

&#x20; console.log("A");



setTimeout(() => {

&#x20; console.log("B"); // ← va a la cola

}, 0);



console.log("C");



// Salida: A → C → B



Aunque el timeout es 0ms, "B" siempre sale al final. El callback espera en la cola hasta que el Call Stack quede completamente vacío, y solo entonces el Event Loop lo empuja para ejecutar.





Resumen rápido

ConceptoEn una fraseHoisting JS declara variables y funciones antes de ejecutar cualquier línea

Closure Una función lleva consigo el entorno donde nació

Event Loop Coordina el código síncrono con los callbacks asíncronos, uno a la vez





## **## 3. Prueba Debugging**



##### Prompt empleado y bloque de código facilitado para su corrección

"*Analiza estas 3 funciones, identifica el error en cada una y explícame por qué fallan.*"



*// 1. Error de referencia (Hoisting)*

&#x09;*function testScope() {*

&#x20; 		*console.log(a);*

&#x20; 		*let a = 10;*

&#x09;*}*	



*// 2. Error de contexto (this)*

&#x09;*const obj = {*

&#x20; 		*name: "Project",*

&#x20; 		*printName: () => {*

&#x20;   		*console.log(this.name);*

&#x20; 		*}*

&#x09;*};*



*// 3. Error de lógica en Array.map*

&#x09;*const numbers = \[1, 2, 3];*

&#x09;*const doubled = numbers.map(num => { num \* 2 });*





##### Resumen análisis test 2



\*\*ChatGPT\*\* | Hace las explicaciones una por una completas. Corrige el error, dando una explicación breve y añadiendo información adicional. En algunas de las correcciones también facilita dos opciones de solución.



\*\*Claude\*\* | Explicación mucho más escueta. Te hace primero unas tarjetas con una explicación resumida de la explicación y luego va una por una corrigiendo el código, en algunos casos facilitando opciones, y debajo otra pequeña explicación más detallada del error.



###### **=====Respuesta ChatGPT=====**



1️⃣ testScope → Problema de Hoisting + TDZ

function testScope() {

&#x20; console.log(a);

&#x20; let a = 10;

}



❌ Error

ReferenceError: Cannot access 'a' before initialization



🧠 Por qué falla

let sí se hoistea, pero no se inicializa inmediatamente

Entra en la llamada Temporal Dead Zone (TDZ)

Desde el inicio del bloque hasta la línea let a = 10, no puedes acceder a a



👉 Aunque parezca que console.log(a) está antes, en realidad:



El motor crea a (hoisting)

Pero no le asigna valor aún

Acceder a ella en ese intervalo → error



✔️ Solución

function testScope() {

&#x20; let a = 10;

&#x20; console.log(a);

}



2️⃣ obj.printName → Problema con this en arrow functions

const obj = {

&#x20; name: "Project",

&#x20; printName: () => {

&#x20;   console.log(this.name);

&#x20; }

};



❌ Error lógico (no lanza excepción)

undefined



🧠 Por qué falla

Las arrow functions NO tienen su propio this

Heredan this del contexto donde se definieron (scope léxico)

En este caso, this no es obj, sino probablemente:

window (en navegador)

undefined (en strict mode / Node)



👉 Por eso this.name no apunta a "Project"



✔️ Solución



Usar función tradicional:



const obj = {

&#x20; name: "Project",

&#x20; printName() {

&#x20;   console.log(this.name);

&#x20; }

};



3️⃣ map → Falta de return

const numbers = \[1, 2, 3];

const doubled = numbers.map(num => { num \* 2 });



❌ Error lógico

\[undefined, undefined, undefined]



🧠 Por qué falla

Cuando usas {} en arrow functions → necesitas return

Aquí la función no devuelve nada → undefined por defecto



👉 Es equivalente a:



num => {

&#x20; num \* 2; // no se retorna nada

}

✔️ Soluciones

Opción 1 (return explícito)

const doubled = numbers.map(num => {

&#x20; return num \* 2;

});

Opción 2 (return implícito)

const doubled = numbers.map(num => num \* 2);

🧩 Resumen rápido

Código	Error	Causa

let a antes de usar	ReferenceError	TDZ (hoisting parcial)

Arrow function con this	undefined	this léxico

map sin return	\[undefined,...]	falta de retorno



###### **=====Respuesta Claude=====**



Error 1 — Temporal Dead Zone con let

js// ❌ Roto

function testScope() {

&#x20; console.log(a); // ReferenceError: Cannot access 'a' before initialization

&#x20; let a = 10;

}



// ✅ Corregido

function testScope() {

&#x20; let a = 10;

&#x20; console.log(a); // 10

}

let y const sí se elevan (hoisting), pero entran en la Temporal Dead Zone: el motor sabe que a existe, pero se niega a dejarte usarla antes de la línea donde la declaras. Con var esto no pasaría — devolvería undefined. Con let es un ReferenceError duro.



Error 2 — Arrow function sin this propio

js// ❌ Roto

const obj = {

&#x20; name: "Project",

&#x20; printName: () => {

&#x20;   console.log(this.name); // undefined (this = window/global)

&#x20; }

};



// ✅ Corregido

const obj = {

&#x20; name: "Project",

&#x20; printName: function() {

&#x20;   console.log(this.name); // "Project"

&#x20; }

};

Las arrow functions capturan el this del contexto léxico donde fueron definidas, no del objeto que las contiene. Como obj se define en el scope global, this apunta a window (en el navegador) o undefined en strict mode. Para métodos de objeto, siempre usa function convencional o la sintaxis abreviada printName() { ... }.



Error 3 — Cuerpo de bloque sin return

js// ❌ Roto — devuelve \[undefined, undefined, undefined]

const doubled = numbers.map(num => { num \* 2 });



// ✅ Opción A: añadir return explícito

const doubled = numbers.map(num => { return num \* 2 });



// ✅ Opción B: quitar las llaves (return implícito)

const doubled = numbers.map(num => num \* 2);

Las llaves { } convierten el cuerpo de la arrow function en un bloque de código, donde el return es obligatorio. Sin ellas, la expresión se retorna automáticamente. Es el error de sintaxis más silencioso de los tres: no lanza ningún error, simplemente llena el array de undefined.





## \## 4. Generación de código



##### Promp empleado en ambas IA



"*Implementa las siguientes tres funciones en JavaScript moderno (ES6+):*

* *Agrupador de datos: Una función que reciba un array de objetos (ej. productos) y el nombre de una propiedad (ej. 'categoría'), y devuelva un objeto donde las llaves sean las categorías y los valores sean arrays con los objetos correspondientes.*
* *Validador de contraseñas: Una función que reciba un string y devuelva un booleano si cumple: mínimo 8 caracteres, una mayúscula, una minúscula y un número.*
* *Consumo de API con Reintentos: Una función asíncrona que use fetch para obtener datos de una URL, pero que si falla, lo reintente automáticamente hasta 3 veces antes de lanzar un error definitivo."*





##### Resumen análisis test 3



* Sintaxis:

ChatGPT escribe código estándar y funcional. Es legible y directo.

Claude utiliza operadores más modernos, como el nullish assignment (??=), ofreciendo un código más compacto y robusto frente a valores nulos.



* Arquitectura y Escalabilidad:

ChatGPT opta por soluciones cerradas. Son eficientes pero difíciles de modificar más adelante.

Claude diseña sistemas modulares. El validador de array permite añadir requisitos sin tocar la lógica principal.



* Robustez en Producción:

En el manejo de APIs, Claude destaca al incluir Backoff Exponencial (espera progresiva entre reintentos), técnica que ChatGPT omitió. 

Claude devuelve objetos de error detallados en lugar de simples booleanos, lo que facilita el trabajo en el Frontend.





###### **=====Respuesta ChatGPT=====**



Aquí tienes implementaciones limpias en JavaScript moderno (ES6+), con explicaciones breves:



1️⃣ 🗂️ Agrupador de datos



✅ Implementación

const agruparPor = (array, propiedad) => {

&#x20; return array.reduce((acc, item) => {

&#x20;   const clave = item\[propiedad];



&#x20;   if (!acc\[clave]) {

&#x20;     acc\[clave] = \[];

&#x20;   }



&#x20;   acc\[clave].push(item);

&#x20;   return acc;

&#x20; }, {});

};



🔍 Ejemplo

const productos = \[

&#x20; { nombre: "Camisa", categoria: "Ropa" },

&#x20; { nombre: "Pantalón", categoria: "Ropa" },

&#x20; { nombre: "Laptop", categoria: "Tecnología" }

];



console.log(agruparPor(productos, "categoria"));



🧠 Idea clave

Usa reduce para construir un objeto

Cada clave agrupa elementos dinámicamente



2️⃣ 🔐 Validador de contraseñas



✅ Implementación

const validarPassword = (password) => {

&#x20; const regex = /^(?=.\*\[a-z])(?=.\*\[A-Z])(?=.\*\\d).{8,}$/;

&#x20; return regex.test(password);

};



🔍 Ejemplo

console.log(validarPassword("Abc12345")); // true

console.log(validarPassword("abc123"));   // false



🧠 Idea clave

(?=.\*\[a-z]) → al menos una minúscula

(?=.\*\[A-Z]) → al menos una mayúscula

(?=.\*\\d) → al menos un número

. {8,} → mínimo 8 caracteres



3️⃣ 🌐 Consumo de API con reintentos



✅ Implementación



const fetchConReintentos = async (url, intentos = 3) => {

&#x20; for (let i = 0; i < intentos; i++) {

&#x20;   try {

&#x20;     const response = await fetch(url);



&#x20;     if (!response.ok) {

&#x20;       throw new Error(`Error HTTP: ${response.status}`);

&#x20;     }



&#x20;     return await response.json();

&#x20;   } catch (error) {

&#x20;     if (i === intentos - 1) {

&#x20;       throw new Error("Falló después de varios intentos");

&#x20;     }

&#x20;   }

&#x20; }

};



🔍 Ejemplo

fetchConReintentos("https://api.example.com/data")

&#x20; .then(data => console.log(data))

&#x20; .catch(err => console.error(err.message));



🧠 Idea clave

Usa async/await

Reintenta dentro de un for

Solo lanza error al final



🧩 Resumen rápido

Función	Técnica clave

Agrupador	reduce + acumulador dinámico

Validador	Expresiones regulares

API retry	async/await + control de errores



###### **=====Respuesta Claude=====**



Aquí tienes el playground interactivo con las tres funciones. Puedes probarlas directamente en el archivo. Aquí el desglose técnico de cada decisión:



1\. groupBy — Agrupador de datos



jsconst groupBy = (arr, key) =>

&#x20; arr.reduce((acc, item) => {

&#x20;   const group = item\[key] ?? 'sin\_categoria';

&#x20;   acc\[group] ??= \[];           // Nullish assignment: crea el array solo si no existe

&#x20;   acc\[group].push(item);

&#x20;   return acc;

&#x20; }, {});



Decisiones clave: el operador ??= (nullish assignment) es ES2021 y evita el clásico if (!acc\[group]) acc\[group] = \[]. El operador ?? en item\[key] ?? 'sin\_categoria' protege contra propiedades null o undefined sin romper con valores falsy como 0 o "".



2\. validatePassword — Validador



jsconst validatePassword = (password) => {

&#x20; const rules = \[

&#x20;   { test: p => p.length >= 8,   msg: 'Mínimo 8 caracteres' },

&#x20;   { test: p => /\[A-Z]/.test(p), msg: 'Al menos una mayúscula' },

&#x20;   { test: p => /\[a-z]/.test(p), msg: 'Al menos una minúscula' },

&#x20;   { test: p => /\\d/.test(p),    msg: 'Al menos un número' },

&#x20; ];

&#x20; const errors = rules.filter(({ test }) => !test(password)).map(({ msg }) => msg);

&#x20; return { valid: errors.length === 0, errors };

};



Decisiones clave: en lugar de devolver solo un boolean, retorna { valid, errors } — mucho más útil en UI real. Cada regla es un objeto { test, msg }, lo que hace trivial añadir nuevas reglas (símbolo especial, longitud máxima, etc.) sin tocar la lógica central.



3\. fetchWithRetry — Fetch con reintentos



jsconst fetchWithRetry = async (url, retries = 3, delay = 500) => {

&#x20; try {

&#x20;   const res = await fetch(url);

&#x20;   if (!res.ok) throw new Error(`HTTP ${res.status}`);  // fetch no lanza en 4xx/5xx

&#x20;   return await res.json();

&#x20; } catch (err) {

&#x20;   if (retries <= 0) throw err;

&#x20;   await new Promise(r => setTimeout(r, delay));

&#x20;   return fetchWithRetry(url, retries - 1, delay \* 2);  // backoff exponencial

&#x20; }

};



Decisiones clave: fetch nativo no lanza error en respuestas 4xx/5xx — solo falla en errores de red. Por eso el if (!res.ok) throw es esencial. El backoff exponencial (delay \* 2) evita saturar el servidor: espera 500ms → 1000ms → 2000ms entre intentos. La recursión es más limpia que un bucle while porque pasa el estado (intentos restantes, delay) sin variables mutables.







## \## 5. Conclusión 



Tras las tres pruebas, he llegado a la conclusión que ChatGPT es bueno para lógicas base rápidas, pero Claude genera código más preparado para una posterior producción y escalabilidad, con una arquitectura más profesional.









\[Escribe aquí tu opinión personal: ¿Cuál usarás para programar y cuál para aprender conceptos teóricos?]

