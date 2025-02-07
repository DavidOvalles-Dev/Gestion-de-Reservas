# Sistema de Gestión de Reservas de Habitaciones

![Status](https://img.shields.io/badge/Status-En%20Desarrollo-yellow) ![License](https://img.shields.io/badge/License-MIT-blue)

Este proyecto es un **Sistema de Gestión de Reservas de Habitaciones**, diseñado para gestionar reservas de habitaciones en un entorno web. Actualmente, el proyecto está en desarrollo y se enfoca en permitir a los usuarios crear, editar, listar y eliminar reservas, así como gestionar la disponibilidad de habitaciones. En el futuro, se planea agregar autenticación de usuarios y roles (cliente/administrador).

---

## Tabla de Contenidos

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Características Principales](#características-principales)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Estado Actual del Proyecto](#estado-actual-del-proyecto)
7. [Mejoras Futuras](#mejoras-futuras)
8. [Contribuciones](#contribuciones)
9. [Licencia](#licencia)
10. [Contacto](#contacto)

---

## Descripción del Proyecto

El **Sistema de Gestión de Reservas de Habitaciones** es una aplicación web que permite gestionar reservas de habitaciones. Los usuarios pueden:
- Crear nuevas reservas seleccionando una habitación, ingresando el nombre del cliente, fechas, horas y estado.
- Editar reservas existentes, actualizando cualquier campo.
- Ver una lista de todas las reservas con detalles como el número de habitación, nombre del cliente, fechas, horas y estado.
- Gestionar la disponibilidad de habitaciones (crear, editar y eliminar habitaciones).

El proyecto está desarrollado utilizando tecnologías modernas como React.js para el frontend, PHP con MySQL para el backend y Bootstrap para el diseño de la interfaz.

---

## Características Principales

### **Funcionalidades Implementadas**
- **Creación de Reservas:** Los usuarios pueden crear nuevas reservas con validación en el frontend y backend.
- **Edición de Reservas:** Los usuarios pueden editar reservas existentes, actualizando cualquier campo.
- **Listado de Reservas:** Muestra una tabla con todas las reservas existentes, incluyendo detalles como el número de habitación, nombre del cliente, fechas, horas y estado.
- **Gestión de Habitaciones:** Permite crear, editar y eliminar habitaciones, con atributos como número de habitación, capacidad, precio y disponibilidad.

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
git clone https://github.com/tu-usuario/sistema-de-reservas.git
cd sistema-de-reservas
```
### 2. Configurar el Backend
1.Copia el archivo .env.example a .env y configura las variables de entorno para la conexión a la base de datos:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=reservations_db
```
2.Importa el archivo SQL (database.sql) en tu servidor MySQL para crear las tablas necesarias.

### 3. Configurar el Frontend
1.Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

### 4. Iniciar el Servidor de Desarrollo
1.Para iniciar el backend:
```bash
php -S localhost:8012 -t API/
```
2.Para iniciar el frontend:
npm start

### 5. Acceder a la Aplicación
 ```bash
Abre tu navegador y navega a http://localhost:3000.
```

Estructura del Proyecto
```bash
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
```

## Estado Actual del Proyecto

### **Lo que ya está hecho:**
- **Formulario para crear y editar reservas:** Los usuarios pueden crear y actualizar reservas con validación en el frontend y backend.
- **Listado de reservas:** Muestra una tabla con todas las reservas existentes, incluyendo detalles como el número de habitación, nombre del cliente, fechas, horas y estado.
- **Gestión de habitaciones:** Permite crear, editar y eliminar habitaciones, con atributos como número de habitación, capacidad, precio y disponibilidad.
- **Validación de datos:** Implementada tanto en el frontend como en el backend para asegurar que todos los campos obligatorios estén completos.

### **Lo que falta por hacer:**
- **Autenticación de Usuarios:** Implementar un sistema de inicio de sesión con roles (cliente/administrador).
- **Filtrado y Paginación:** Agregar opciones para filtrar reservas por fecha, estado o habitación, e implementar paginación para manejar grandes volúmenes de datos.
- **Notificaciones:** Enviar notificaciones automáticas cuando una reserva esté próxima a vencer.
- **Interfaz Responsiva:** Mejorar la experiencia del usuario en dispositivos móviles.

---

## Mejoras Futuras

1. **Autenticación de Usuarios:**
   - Implementar un sistema de inicio de sesión con roles (cliente y administrador).
   - Restringir ciertas acciones según el rol del usuario.

2. **Filtrado y Paginación:**
   - Agregar opciones para filtrar reservas por fecha, estado o habitación.
   - Implementar paginación para manejar grandes volúmenes de datos.

3. **Notificaciones:**
   - Enviar notificaciones automáticas cuando una reserva esté próxima a vencer.

4. **Interfaz Responsiva:**
   - Mejorar la experiencia del usuario en dispositivos móviles.

---

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## Contribuciones

Este proyecto es personal y está diseñado para demostrar mis habilidades técnicas. Sin embargo, si tienes sugerencias o ideas para mejorarlo, ¡estaré encantado de escucharlas!

---

## Contacto

Si deseas contactarme para hablar sobre este proyecto o colaborar en otros desarrollos, puedes encontrarme en:

- **Correo Electrónico:** aovalles1155@gmail.com
- **LinkedIn:** [Mi perfil de LinkedIn](https://www.linkedin.com/in/angel-ovalles-a0450532a/)
- **GitHub:** [Mi repositorio](https://github.com/DavidOvalles-Dev)
