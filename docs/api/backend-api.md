# Herramientas para el Desarrollo de APIs



A continuación se destacan las herramientas fundamentales utilizadas en la arquitectura, testing y monitorización de servicios Backend.



## 1\. Axios



Es una librería de JavaScript que funciona como un cliente HTTP basado en "promesas". Se puede usar tanto en el navegador como en Node.js.En su caso transforma automáticamente los datos a JSON y permite ejecutar código antes de que una petición se envíe o llegue la respuesta. 



Esta herramienta no ha sido usada para el proyecto de TaskFlow ya que se ha empleado finalmente la API nativa fetch, evitando así la instalación de libreria extena. 





## 2\. Postman



Es una plataforma colaborativa para el diseño, construcción y prueba de APIs. Es una herramienta que permite enviar peticiones HTTP sin necesidad de tener un frontend desarrollado.



Se ha empleado en nuestro proyecto para la prueba de las diferentes funcionalidad de la API. Se ha probado de forma aislada los cuatro endpoints de la aplicación (GET, POST, PUT y DELETE). Se puede generar colecciones de peticiones que sirven como guía para otros desarrolladores. En nuestro caso se ha facilitado una copia de la colección creada con las pruebas dentro del repositorio del proyecto junto con capturas de imagen de las pruebas ya realizadas. 





## 3\. Sentry



Es una herramienta de monitoreo de errores y rendimiento en tiempo real (Error Tracking). Cuando un usuario experimenta un fallo en la web, Sentry envía una alerta inmediata al desarrollador con el error exacto y la línea de código afectada. Registra qué navegador usaba el usuario y qué pasos dio antes del error, facilitando enormemente la corrección de bugs.



Esta herramienta no se ha usado en el proyecto TaskFlow. En lugar de la configuración automática que aporta Sentry, se ha creado una gestión manual de errores basada en el backend, con console.log o console.error; y en el frontend, usando bloques try...catch y configurando un banner rojo en la UI por medio de la función showError().





## 4\. Swagger (OpenAPI)



Es un conjunto de herramientas de código abierto que ayudan a los desarrolladores a diseñar, construir, documentar y consumir servicios web RESTful. Genera una página web donde cualquier persona puede ver qué hace la API y probar los endpoints directamente desde el navegador con un botón de "Try it out". Define un "contrato" entre el frontend y el backend para que ambos equipos sepan exactamente qué datos deben enviarse y recibirse.



En lugar de emplear esta herramienta automática, para el proyecto TaskFlow se han generado de forma manual dos piezas que lo sustituirían: el documento README.md, incluyendo una tabla de los endpoints configurados y ejemplos; junto con la colección de Postman, en la carpeta de api/Fase 1 con las capturas de imagen de los cuatro endpoints y el resultado que nos ha proporcionado. 

