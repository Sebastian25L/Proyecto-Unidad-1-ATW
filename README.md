HotelReservas

Sistema web para la administración de reservas hoteleras, desarrollado como proyecto de la asignatura Aplicación de Tecnologías Web.

---

Descripción

HotelReservas es una aplicación frontend que centraliza la gestión operativa de un hotel: clientes, habitaciones y reservas. Todo funciona con datos simulados, sin necesidad de backend ni base de datos real.

La idea nació de la necesidad de digitalizar procesos que muchos hoteles pequeños todavía manejan en papel o en hojas de calculo. Con esta plataforma, el personal puede registrar clientes, ver el estado de cada habitación y gestionar reservas desde una sola pantalla.

---

Problema que resuelve

Los hoteles pequeños y medianos suelen no tener un sistema centralizado. Las reservas se anotan a mano, no hay visibilidad del estado de las habitaciones en tiempo real y es fácil perder información de clientes. HotelReservas resuelve eso con una interfaz simple y rápida.

---

Publico objetivo

- Personal de recepción de hoteles
- Administradores de establecimientos de hospedaje
- Supervisores que necesitan ver el estado general del hotel de un vistazo

---

Framework seleccionado

Angular — seleccionado al inicio de la actividad por su arquitectura modular, soporte nativo de TypeScript y facilidad para construir aplicaciones escalables con componentes reutilizables.

---

Tecnologias utilizadas
Angular 
TypeScript
Tailwind CSS 
Angular Router 
Angular Signals 

---

Instalación y ejecución

2. Entrar a la carpeta del frontend
cd hotel-reservas/frontend/hotel-reservas-frontend

3. Instalar dependencias
npm install

4. Iniciar el servidor de desarrollo
npm start

Abrir el navegador en `http://localhost:4200`

Credenciales de acceso:
- Usuario: `admin123`
- Contraseña: `admin123`

---

Estructura del proyecto
src/
└── app/
    ├── core/
    │   ├── data/          Datos mock (clientes, habitaciones, reservas)
    │   ├── guards/        Protección de rutas (authGuard, guestGuard)
    │   ├── models/        Interfaces TypeScript
    │   ├── services/      Lógica de negocio
    │   └── stores/        Estado global con Signals
    ├── layouts/
    │   ├── auth-layout/       Layout para login
    │   └── dashboard-layout/  Layout principal con sidebar y navbar
    ├── shared/
    │   └── components/    Componentes reutilizables (Badge, Button, Modal, etc.)
    └── views/
        ├── login/
        ├── dashboard/
        ├── clientes/
        ├── habitaciones/
        ├── reservas/
        └── agenda/

---

Secciones del sistema

Login — autenticación simulada con usuario y contraseña. Incluye toggle para mostrar/ocultar contrasena.

Dashboard — vista general con estadísticas de reservas, habitaciones disponibles, clientes activos e ingresos. Incluye tabla de reservas recientes y barras de ocupación.

Clientes — listado con busqueda y filtro por estado. Permite registrar, editar y activar/desactivar clientes.

Habitaciones — vista en grilla o lista con filtros por tipo y estado. Cada habitación tiene pagina de detalle con amenidades y cambio de estado directo.

Reservas — tabla con tabs por estado (pendiente, confirmada, en curso, completada, cancelada). Permite crear, editar y cancelar reservas con modal de confirmación.

Agenda — calendario interactivo navegable por mes. Al hacer clic en un dia muestra las reservas activas para esa fecha en un panel lateral.

---

Diseño responsivo

La aplicación esta diseñada para funcionar en cualquier tamano de pantalla.

---

Sebastián Lanche
Asignatura: Aplicación de Tecnologías Web
