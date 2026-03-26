# \*\* PRIMER CONTACTO CON CURSOR \*\*



1. ## Atajos de teclado



Algunos de los atajos de teclado más empleados durante el testeo con el programa Cursor en el proyecto TaskFlow son:



* Ctrl + K: Genera y edita código en una línea o bloque
* Ctrl + L: Abre el chat de IA
* Ctrl + I: Abre Composer para cambios en varios archivos
* @ : Para mencionar archivos, carpetas o documentación concreta en el chat.





## 2\. Ejemplos de mejora código con Cursor:



##### a) Corrección barra de búsqueda:



La barra de filtrado por texto no funcionaba. Seleccionando el archivo app.js, en concreto la función renderAllTasks(), Cursor ha detectado que había un error y no estaba funcionando este filtrado en concreto. Realizó los siguientes cambios: 



*Agregué matchesSearch para filtrar por task.title usando includes(searchText).*

*Corregí el return: antes repetía matchesType y no usaba el texto de búsqueda.*



Aceptando estas modificaciones la función ya filtra correctamente.



##### b) Corrección del diseño para pantallas 1K:



El diseño de la app en pantallas 1K se rompía cortándose la pantalla sin mostrar todo el aside. Cursor identifica el problema y responde:



*Qué estaba pasando en 1K (≈1024px)*

*En lg tu aside tenía lg:h-screen + sticky, y si su contenido es más alto que la pantalla, se recorta (no hay scroll vertical).*

*En layout flex-row, a veces el main necesita min-w-0 para poder encogerse sin generar overflow “raro”.*

*El header podía empujar/cortar en ancho, así que lo hice wrappable.*

*Cómo lo arreglé en weekyCheck/index.html*

*Sidebar scrolleable en lg: cambié lg:h-screen por lg:max-h-screen lg:overflow-y-auto*

*Main sin overflow por flex: añadí min-w-0*

*Header responsive: añadí flex-wrap gap-4*





