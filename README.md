# Sistema de Gestión de Reservas de Habitaciones

![Status](https://img.shields.io/badge/Status-Terminado-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

Este proyecto es un **Sistema de Gestión de Reservas de Habitaciones**, diseñado para gestionar reservas de habitaciones en un entorno web. La aplicación permite a los usuarios crear, editar, listar y eliminar reservas, así como gestionar la disponibilidad de habitaciones. Además, cuenta con autenticación de usuarios y roles (cliente/administrador) para garantizar un acceso seguro y controlado.

---

## Tabla de Contenidos

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Características Principales](#características-principales)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Estado Actual del Proyecto](#estado-actual-del-proyecto)
7. [Capturas de Pantalla](#capturas-de-pantalla)
8. [Contribuciones](#contribuciones)
9. [Licencia](#licencia)
10. [Contacto](#contacto)

---

## Descripción del Proyecto

El **Sistema de Gestión de Reservas de Habitaciones** es una aplicación web completa que permite gestionar reservas de habitaciones en un entorno seguro y eficiente. Los usuarios pueden:
- **Crear nuevas reservas** seleccionando una habitación, ingresando el nombre del cliente, fechas, horas y estado.
- **Editar reservas existentes**, actualizando cualquier campo.
- **Ver una lista de todas las reservas** con detalles como el número de habitación, nombre del cliente, fechas, horas y estado.
- **Gestionar la disponibilidad de habitaciones** (crear, editar y eliminar habitaciones).

La aplicación cuenta con un sistema de autenticación que permite a los usuarios registrarse e iniciar sesión con roles específicos (cliente o administrador), garantizando que solo los usuarios autorizados puedan realizar ciertas acciones.

---

## Características Principales

### **Funcionalidades Implementadas**
- **Autenticación de Usuarios:** Los usuarios pueden registrarse e iniciar sesión con roles específicos (cliente o administrador).
- **Creación de Reservas:** Los usuarios pueden crear nuevas reservas con validación en el frontend y backend.
- **Edición de Reservas:** Los usuarios pueden editar reservas existentes, actualizando cualquier campo.
- **Listado de Reservas:** Muestra una tabla con todas las reservas existentes, incluyendo detalles como el número de habitación, nombre del cliente, fechas, horas y estado.
- **Gestión de Habitaciones:** Permite crear, editar y eliminar habitaciones, con atributos como número de habitación, capacidad, precio y disponibilidad.
- **Diseño Responsivo:** La interfaz es completamente responsiva, adaptándose a dispositivos móviles y de escritorio.

### **Validaciones**
- Validación en el frontend y backend para asegurar que todos los campos obligatorios estén completos.
- El backend devuelve un código de estado HTTP adecuado (por ejemplo, `400 Bad Request`) cuando hay errores.

---

## Tecnologías Utilizadas

### **Frontend**
- **React.js:** Framework para construir interfaces de usuario.
- **Axios:** Biblioteca para realizar solicitudes HTTP al backend.
- **SweetAlert2:** Biblioteca para mostrar alertas personalizadas.
- **Bootstrap:** Framework CSS para estilizar los componentes.

### **Backend**
- **PHP:** Lenguaje de programación para construir la API RESTful.
- **MySQL:** Base de datos relacional para almacenar habitaciones y reservas.
- **PDO:** Extensión de PHP para interactuar con la base de datos de manera segura.

### **Base de Datos**
- **Tablas Principales:**
  - `rooms`: Almacena información sobre las habitaciones (número, capacidad, precio, disponibilidad).
  - `reservations`: Almacena información sobre las reservas (habitación, cliente, fechas, horas, estado).
  - `users`: Almacena información de los usuarios (nombre, correo, contraseña, rol).

---

## Instalación y Configuración

### Requisitos Previos
- Node.js (v16 o superior)
- PHP (v7.4 o superior)
- MySQL
- Composer (opcional)

### Pasos para Instalar

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/DavidOvalles-Dev/Gestion-de-Reservas.git
cd sistema-de-reservas
```

### 2. Configurar el Backend
Copia el archivo `.env.example` a `.env` y configura las variables de entorno para la conexión a la base de datos:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=reservations_db
```
Importa el archivo SQL (database.sql) en tu servidor MySQL para crear las tablas necesarias.

3. Configurar el Frontend
Navega al directorio del frontend:

```bash
cd frontend
```
Instala las dependencias: 
```bash
npm install
```
4. Iniciar el Servidor de Desarrollo
Para iniciar el backend:

```powershell
php -S localhost:8012 -t API/
```
Para iniciar el frontend:
```powershell
cd frontend
```
```powershell
npm install
```
```powershell
npm start
```

sistema-de-reservas/
├── API/                # Backend PHP con la API RESTful
│   ├── controllers/    # Controladores para manejar las solicitudes
│   ├── models/         # Modelos para interactuar con la base de datos
│   ├── routes.php      # Rutas de la API
│   └── .env            # Variables de entorno
├── frontend/           # Frontend React.js
│   ├── src/            # Código fuente del frontend
│   │   ├── components/ # Componentes reutilizables
│   │   ├── App.js      # Componente principal
│   │   └── index.js    # Punto de entrada de la aplicación
│   ├── package.json    # Dependencias del frontend
│   └── README.md       # Documentación del frontend
└── database.sql        # Script SQL para configurar la base de datos

Estado Actual del Proyecto
El proyecto está completamente terminado y cuenta con todas las funcionalidades planeadas, incluyendo:

Autenticación de Usuarios: Los usuarios pueden registrarse, iniciar sesión y acceder a funcionalidades según su rol (cliente o administrador).

Gestión de Reservas: Crear, editar, listar y eliminar reservas.

Gestión de Habitaciones: Crear, editar y eliminar habitaciones.

Validación de Datos: Validaciones en el frontend y backend para garantizar la integridad de los datos.

Diseño Responsivo: La interfaz es compatible con dispositivos móviles y de escritorio.

Capturas de Pantalla
Login
![image](https://github.com/user-attachments/assets/50b2ba4f-1079-4a85-b2b3-7518fcac5a8d)

Listado de Reserva
![image](https://github.com/user-attachments/assets/82021d76-b65f-452d-ba31-80824b0d3fb4)


Crear Reserva
![image](https://github.com/user-attachments/assets/b0d5e279-d9f4-4e00-8bd5-68cdf490439f)

Listado de Habitaciones
![image](https://github.com/user-attachments/assets/059dade4-a047-4aff-a870-2ee87d5922f6)

Contribuciones
Este proyecto es personal y está diseñado para demostrar mis habilidades técnicas. Sin embargo, si tienes sugerencias o ideas para mejorarlo, ¡estaré encantado de escucharlas!

Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

Contacto
Si deseas contactarme para hablar sobre este proyecto o colaborar en otros desarrollos, puedes encontrarme en:

Correo Electrónico: aovalles1155@gmail.com

LinkedIn: Mi perfil de LinkedIn

GitHub: Mi repositorio
