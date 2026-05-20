import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservasService } from '../../core/services/reservas.service';
import { HabitacionesService } from '../../core/services/habitaciones.service';
import { ClientesService } from '../../core/services/clientes.service';
import { AuthStore } from '../../core/stores/auth.store';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { Reserva } from '../../core/models/reserva.model';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent, BadgeComponent],
  template: `
    <div class="space-y-6 animate-fade-in">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">
            Bienvenido, {{ authStore.userName() }}
          </h1>
          <p class="text-slate-500 text-sm mt-0.5">Aqui tienes el resumen operativo del dia.</p>
        </div>
        <a
          routerLink="/reservas/nueva"
          class="inline-flex items-center gap-2 bg-[#c9a84c] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b8963e] transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Reserva
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <app-stat-card
          label="Total Reservas"
          [value]="reservasService.totalReservas()"
          subtitle="Todas las reservas"
          [trend]="12"
          iconBg="bg-blue-50"
        >
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </app-stat-card>

        <app-stat-card
          label="Habitaciones Disponibles"
          [value]="habitacionesService.disponibles()"
          [subtitle]="'de ' + habitacionesService.totalHabitaciones() + ' habitaciones'"
          iconBg="bg-emerald-50"
        >
          <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </app-stat-card>

        <app-stat-card
          label="Clientes Activos"
          [value]="clientesService.clientesActivos()"
          [subtitle]="'de ' + clientesService.totalClientes() + ' clientes'"
          [trend]="5"
          iconBg="bg-purple-50"
        >
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </app-stat-card>

        <app-stat-card
          label="Ingresos Totales"
          [value]="'S/ ' + reservasService.ingresosTotales().toLocaleString()"
          subtitle="Reservas no canceladas"
          [trend]="8"
          iconBg="bg-amber-50"
        >
          <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </app-stat-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="text-base font-semibold text-slate-800">Reservas Recientes</h3>
            <a routerLink="/reservas" class="text-xs text-[#0f2044] font-medium hover:underline">Ver todas</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Codigo</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Hab.</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th class="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Total</th>
                </tr>
              </thead>
              <tbody>
                @for (r of recentReservas; track r.id) {
                  <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-3 font-mono text-xs text-slate-600">{{ r.codigo }}</td>
                    <td class="px-6 py-3 font-medium text-slate-800">{{ r.clienteNombre }}</td>
                    <td class="px-6 py-3 text-slate-500 hidden sm:table-cell">{{ r.habitacionNumero }}</td>
                    <td class="px-6 py-3">
                      <app-badge [variant]="getEstadoVariant(r.estado)" [dot]="true">
                        {{ getEstadoLabel(r.estado) }}
                      </app-badge>
                    </td>
                    <td class="px-6 py-3 text-right font-medium text-slate-700 hidden md:table-cell">
                      S/ {{ r.precioTotal.toLocaleString() }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="text-base font-semibold text-slate-800">Estado Habitaciones</h3>
            <a routerLink="/habitaciones" class="text-xs text-[#0f2044] font-medium hover:underline">Ver</a>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-slate-600 font-medium">Disponibles</span>
                <span class="text-emerald-600 font-bold">{{ habitacionesService.disponibles() }}</span>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  [style.width.%]="(habitacionesService.disponibles() / habitacionesService.totalHabitaciones()) * 100"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-slate-600 font-medium">Ocupadas</span>
                <span class="text-blue-600 font-bold">{{ habitacionesService.ocupadas() }}</span>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-500 rounded-full transition-all duration-500"
                  [style.width.%]="(habitacionesService.ocupadas() / habitacionesService.totalHabitaciones()) * 100"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-slate-600 font-medium">Mantenimiento</span>
                <span class="text-amber-600 font-bold">{{ habitacionesService.enMantenimiento() }}</span>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-amber-500 rounded-full transition-all duration-500"
                  [style.width.%]="(habitacionesService.enMantenimiento() / habitacionesService.totalHabitaciones()) * 100"
                ></div>
              </div>
            </div>

            <div class="border-t border-slate-100 pt-4">
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-slate-50 rounded-lg p-3 text-center">
                  <p class="text-2xl font-bold text-slate-800">{{ habitacionesService.totalHabitaciones() }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">Total</p>
                </div>
                <div class="bg-emerald-50 rounded-lg p-3 text-center">
                  <p class="text-2xl font-bold text-emerald-700">
                    {{ ((habitacionesService.ocupadas() / habitacionesService.totalHabitaciones()) * 100).toFixed(0) }}%
                  </p>
                  <p class="text-xs text-slate-500 mt-0.5">Ocupacion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        @for (action of quickActions; track action.label) {
          <a
            [routerLink]="action.route"
            class="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
          >
            <div [class]="'w-10 h-10 rounded-xl flex items-center justify-center ' + action.iconBg">
              <span [innerHTML]="action.icon" [class]="action.iconColor"></span>
            </div>
            <span class="text-xs font-medium text-slate-700 text-center">{{ action.label }}</span>
          </a>
        }
      </div>
    </div>
  `,
})
export class DashboardView {
  reservasService = inject(ReservasService);
  habitacionesService = inject(HabitacionesService);
  clientesService = inject(ClientesService);
  authStore = inject(AuthStore);

  get recentReservas(): Reserva[] {
    return this.reservasService.getAll().slice(0, 5);
  }

  readonly quickActions = [
    {
      label: 'Nueva Reserva',
      route: '/reservas/nueva',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>`,
      iconBg: 'bg-[#0f2044]',
      iconColor: 'text-white',
    },
    {
      label: 'Nuevo Cliente',
      route: '/clientes/nuevo',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>`,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Ver Agenda',
      route: '/agenda',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Habitaciones',
      route: '/habitaciones',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  getEstadoVariant(estado: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gold' {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gold'> = {
      confirmada: 'success',
      en_curso: 'info',
      pendiente: 'warning',
      completada: 'neutral',
      cancelada: 'danger',
    };
    return map[estado] ?? 'neutral';
  }

  getEstadoLabel(estado: string): string {
    const map: Record<string, string> = {
      confirmada: 'Confirmada',
      en_curso: 'En Curso',
      pendiente: 'Pendiente',
      completada: 'Completada',
      cancelada: 'Cancelada',
    };
    return map[estado] ?? estado;
  }
}
