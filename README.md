# TaskFlow - Gestión de Tareas

## Descripción

TaskFlow es una aplicación moderna de gestión de tareas que te ayuda a organizar tu día a día de forma sencilla y eficiente. Con una interfaz intuitiva y funcionalidades completas, puedes crear, organizar y completar tus tareas personales y de trabajo.

## Funcionalidades Principales

- **📝 Gestión completa de tareas**: Crea, edita, elimina y marca como completadas tus tareas
- **🎯 Sistema de prioridades**: Organiza por baja 🟢, media 🟡 y alta 🔴 prioridad
- **📂 Clasificación inteligente**: Separa entre tareas personales y de trabajo
- **🔍 Filtros avanzados**: Busca y filtra por estado, prioridad, tipo y texto
- **🌙 Modo oscuro**: Cambia entre tema claro y oscuro según tu preferencia
- **⏱️ Temporizador Pomodoro**: Enfócate con temporizadores de 25 minutos
- **📊 Estadísticas en tiempo real**: Visualiza tu progreso con gráficos interactivos
- **💾 Exportación de datos**: Descarga tus tareas en formato JSON para respaldo

## Tecnologías Utilizadas

<div align="center">
  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

## Instalación y Ejecución

### Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn

### Pasos para ejecutar el proyecto

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/nataliagalanalv/taskflow-project.git
   cd taskflow-project
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   Crea un archivo `.env` en la carpeta `/api` con las siguientes variables:
   ```
   PORT=3000
   MONGODB_URI=tu_uri_de_conexion_a_mongodb
   ```

4. **Inicia el servidor**
   ```bash
   cd api
   npm run dev
   ```

5. **Accede a la aplicación**
   Abre tu navegador y ve a `http://localhost:3000`

## Estructura del Proyecto

```
taskflow-project/
├── 📁 api/                    # Backend API REST
│   ├── index.js              # Punto de entrada del servidor
│   ├── routes/               # Definición de rutas
│   ├── controllers/          # Lógica de controladores
│   ├── services/             # Lógica de negocio
│   ├── models/               # Modelos de datos
│   └── config/               # Configuración y variables de entorno
├── 📁 weekyCheck/            # Frontend SPA
│   ├── index.html            # Página principal
│   ├── css/                  # Estilos CSS
│   ├── js/                   # Lógica JavaScript
│   └── assets/               # Recursos estáticos
└── 📄 README.md              # Documentación del proyecto
```

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

**Hecho por [Natalia Galán](https://github.com/nataliagalanalv)**