# Informe de Pruebas de API - Fase 1 (Base)



\*\*Proyecto:\*\* TaskFlow (Corner Estudios)   





## 1\. Objetivo de las Pruebas



Validar la comunicación entre el cliente (Postman) y el servidor Node.js, asegurando que los endpoints del Router responden correctamente tanto en casos de éxito como en la gestión de errores (Validación de Datos y Existencia de Recursos).





## 2\. Secuencia de Resultados



Se han ejecutado 4 pruebas clave para cubrir todas las acciones del Router.



| ID | Acción | Endpoint | Resultado Esperado | Resultado Obtenido | Estado |

| :--- | :--- | :--- | :--- | :--- | :--- |

| \*\*01\*\* | Listar | `GET /tasks` | 200 OK | 200 OK | ✅ PASA |

| \*\*02\*\* | Crear | `POST /tasks` | 400 Bad Request | 400 Bad Request | ✅ PASA |

| \*\*03\*\* | Actualizar | `PATCH /tasks/:id` | 200 OK | 200 OK | ✅ PASA |

| \*\*04\*\* | Borrar | `DELETE /tasks/:id` | 404 Not Found | 404 Not Found | ✅ PASA |



\---



## 3\. Análisis de los resultados erróneos



##### A. Gestión de Errores de Validación (POST)



Al intentar crear una tarea sin el campo obligatorio \*\*title\*\*, el servidor intercepta la petición y responde \*\*400 Bad Request\*\*. Esto evita la creación de registros "basura" en la base de datos.



\* \*\*Captura:\*\* !\[Error 400 POST]("taskflow-project\\docs\\api\\Fase 1\\Fase1\_tests\_POST.png")



##### B. Gestión de Recursos Inexistentes (DELETE)



Al solicitar la eliminación de un ID que no figura en el sistema, el servidor devuelve un \*\*404 Not Found\*\*. Esto confirma que el servidor verifica la existencia del recurso antes de gestionar la solicitud.



\* \*\*Captura:\*\* !\[Error 404 DELETE]("taskflow-project\\docs\\api\\Fase 1\\Fase1\_tests\_DELETE.png")





## 4\. Archivos Adjuntos en el Repositorio



Para permitir la replicación de estas pruebas, se han incluido los siguientes recursos en esta carpeta:



\* \*\*`TaskFlow\_Fase1.postman\_collection.json`\*\*: Colección completa para importar en Postman.



\* \*\*`/img/`\*\*: Capturas de pantalla con los códigos de estado y cuerpos de respuesta.





## 5\. Conclusión



La API cumple con los estándares de diseño \*\*RESTful\*\*. Las validaciones en el controlador son efectivas y proporcionan el feedback necesario al cliente mediante los códigos de estado HTTP adecuados.





