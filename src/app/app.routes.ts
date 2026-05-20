import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirect root
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // Auth layout (login)
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./views/login/login.view').then(m => m.LoginView),
        title: 'Iniciar Sesión — HotelReservas',
      },
    ],
  },

  // Unauthorized
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./views/unauthorized/unauthorized.view').then(m => m.UnauthorizedView),
    title: 'Acceso No Autorizado — HotelReservas',
  },

  // Dashboard layout (protected)
  {
    path: '',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./views/dashboard/dashboard.view').then(m => m.DashboardView),
        title: 'Dashboard — HotelReservas',
      },

      // Clientes
      {
        path: 'clientes',
        loadComponent: () =>
          import('./views/clientes/clientes.view').then(m => m.ClientesView),
        title: 'Clientes — HotelReservas',
      },
      {
        path: 'clientes/nuevo',
        loadComponent: () =>
          import('./views/clientes/cliente-form.view').then(m => m.ClienteFormView),
        title: 'Nuevo Cliente — HotelReservas',
      },
      {
        path: 'clientes/:id/editar',
        loadComponent: () =>
          import('./views/clientes/cliente-form.view').then(m => m.ClienteFormView),
        title: 'Editar Cliente — HotelReservas',
      },

      // Habitaciones
      {
        path: 'habitaciones',
        loadComponent: () =>
          import('./views/habitaciones/habitaciones.view').then(m => m.HabitacionesView),
        title: 'Habitaciones — HotelReservas',
      },
      {
        path: 'habitaciones/nueva',
        loadComponent: () =>
          import('./views/habitaciones/habitacion-form.view').then(m => m.HabitacionFormView),
        title: 'Nueva Habitación — HotelReservas',
      },
      {
        path: 'habitaciones/:id',
        loadComponent: () =>
          import('./views/habitaciones/habitacion-detail.view').then(m => m.HabitacionDetailView),
        title: 'Detalle Habitación — HotelReservas',
      },
      {
        path: 'habitaciones/:id/editar',
        loadComponent: () =>
          import('./views/habitaciones/habitacion-form.view').then(m => m.HabitacionFormView),
        title: 'Editar Habitación — HotelReservas',
      },

      // Reservas
      {
        path: 'reservas',
        loadComponent: () =>
          import('./views/reservas/reservas.view').then(m => m.ReservasView),
        title: 'Reservas — HotelReservas',
      },
      {
        path: 'reservas/nueva',
        loadComponent: () =>
          import('./views/reservas/reserva-form.view').then(m => m.ReservaFormView),
        title: 'Nueva Reserva — HotelReservas',
      },
      {
        path: 'reservas/:id/editar',
        loadComponent: () =>
          import('./views/reservas/reserva-form.view').then(m => m.ReservaFormView),
        title: 'Editar Reserva — HotelReservas',
      },

      // Agenda
      {
        path: 'agenda',
        loadComponent: () =>
          import('./views/agenda/agenda.view').then(m => m.AgendaView),
        title: 'Agenda — HotelReservas',
      },
    ],
  },

  // Wildcard
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
