# \*\* USO DE MODEL CONTEXT PROTOCOL (MCP) EN TASKFLOW \*\*



1. ## Instalación del servidor MCP en VS Code



Para la primera parte del ejercicio y para la parte 2 se ha empleado Cursor y su AI, pero debido al coste se procede a configurar MCP en VS Code para continuar con el proyecto. Para ello se han seguido los siguientes pasos:



a) Extensión: Instalación de Cline desde el Marketplace de VS Code.



b) Permisos de Sistema (Windows): Ejecución de Set-ExecutionPolicy RemoteSigned en PowerShell como administrador para permitir el uso de npm debido a su restricción por seguridad.



c) Servidor MCP: Instalación global del servidor de archivos mediante npm install -g @modelcontextprotocol/server-filesystem.



d) Configuración JSON: Apertura de cline\_mcp\_settings.json e inserción del servidor filesystem con la ruta absoluta del proyecto y el comando npx.cmd.



e) Modelo: Selección de un modelo gratuito con soporte de Tools en la configuración de API de Cline.



f) Comprobación: Se verifica el acceso a toda la documentación y archivos desde MCP probando de generar nuevo documento.





## 2\. Beneficios del uso de MCP en proyectos reales



MCP es útil ya que convierte a la IA de un simple 'chat de texto' en un asistente real que puede interactuar con nuestros archivos, bases de datos y herramientas de desarrollo. Para un programador, esto marca la diferencia al poder trabajar más rápido, tener menos errores al organizar el código y poder manejar proyectos grandes con facilidad.

