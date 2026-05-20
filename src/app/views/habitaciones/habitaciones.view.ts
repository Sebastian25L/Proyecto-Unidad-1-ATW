import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HabitacionesService } from '../../core/services/habitaciones.service';
import { Habitacion, HabitacionEstado } from '../../core/models/habitacion.model';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-habitaciones-view',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BadgeComponent],
  template: `
    <div class="space-y-6 animate-fade-in">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Habitaciones</h1>
          <p class="text-slate-500 text-sm mt-0.5">
            {{ habitacionesService.totalHabitaciones() }} habitaciones ·
            <span class="text-emerald-600">{{ habitacionesService.disponibles() }} disponibles</span>
          </p>
        </div>
        <a
          routerLink="/habitaciones/nueva"
          class="inline-flex items-center gap-2 bg-[#0f2044] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3260] transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Habitación
        </a>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        @for (stat of statusStats; track stat.label) {
          <button
            (click)="filterEstado = filterEstado === stat.value ? '' : stat.value"
            [class]="'rounded-xl border p-4 text-left transition-all duration-200 ' +
              (filterEstado === stat.value
                ? 'border-[#0f2044] bg-[#0f2044] text-white shadow-md'
                : 'border-slate-200 bg-white hover:shadow-sm')"
          >
            <p [class]="'text-2xl font-bold ' + (filterEstado === stat.value ? 'text-white' : stat.color)">
              {{ stat.count() }}
            </p>
            <p [class]="'text-xs font-medium mt-0.5 ' + (filterEstado === stat.value ? 'text-white/80' : 'text-slate-500')">
              {{ stat.label }}
            </p>
          </button>
        }
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
              </svg>
            </span>
            <input
              type="text" [(ngModel)]="searchQuery"
              placeholder="Buscar por número o tipo..."
              class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"
            />
          </div>
          <select
            [(ngModel)]="filterTipo"
            class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] bg-white"
          >
            <option value="">Todos los tipos</option>
            <option value="Simple">Simple</option>
            <option value="Doble">Doble</option>
            <option value="Suite">Suite</option>
            <option value="Suite Presidencial">Suite Presidencial</option>
            <option value="Familiar">Familiar</option>
          </select>
          <div class="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              (click)="viewMode.set('grid')"
              [class]="'p-1.5 rounded-md transition-colors ' + (viewMode() === 'grid' ? 'bg-white shadow-sm text-[#0f2044]' : 'text-slate-400 hover:text-slate-600')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button
              (click)="viewMode.set('list')"
              [class]="'p-1.5 rounded-md transition-colors ' + (viewMode() === 'list' ? 'bg-white shadow-sm text-[#0f2044]' : 'text-slate-400 hover:text-slate-600')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      @if (viewMode() === 'grid') {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          @for (hab of filteredHabitaciones(); track hab.id) {
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
              <!-- Color header by status -->
              <div [class]="'h-2 ' + getEstadoColor(hab.estado)"></div>
              <div class="p-4">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <p class="text-lg font-bold text-slate-800">Hab. {{ hab.numero }}</p>
                    <p class="text-xs text-slate-500">Piso {{ hab.piso }}</p>
                  </div>
                  <app-badge [variant]="getEstadoVariant(hab.estado)" [dot]="true">
                    {{ getEstadoLabel(hab.estado) }}
                  </app-badge>
                </div>

                <div class="space-y-1.5 mb-4">
                  <div class="flex items-center gap-2 text-xs text-slate-600">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    {{ hab.tipo }}
                  </div>
                  <div class="flex items-center gap-2 text-xs text-slate-600">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Capacidad: {{ hab.capacidad }} persona{{ hab.capacidad > 1 ? 's' : '' }}
                  </div>
                  <div class="flex items-center gap-2 text-xs font-semibold text-[#c9a84c]">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    S/ {{ hab.precioPorNoche }}/noche
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <a
                    [routerLink]="['/habitaciones', hab.id]"
                    class="flex-1 text-center py-1.5 text-xs font-medium text-[#0f2044] border border-[#0f2044] rounded-lg hover:bg-[#0f2044] hover:text-white transition-colors"
                  >
                    Ver detalle
                  </a>
                  <a
                    [routerLink]="['/habitaciones', hab.id, 'editar']"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-[#0f2044] hover:bg-slate-100 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-span-full py-12 text-center">
              <p class="text-slate-400 text-sm">No se encontraron habitaciones</p>
            </div>
          }
        </div>
      }

      @if (viewMode() === 'list') {
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Habitación</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Tipo</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Capacidad</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio/Noche</th>
                  <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th class="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (hab of filteredHabitaciones(); track hab.id) {
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4">
                      <p class="font-semibold text-slate-800">Hab. {{ hab.numero }}</p>
                      <p class="text-xs text-slate-400">Piso {{ hab.piso }}</p>
                    </td>
                    <td class="px-6 py-4 text-slate-600 hidden sm:table-cell">{{ hab.tipo }}</td>
                    <td class="px-6 py-4 text-slate-600 hidden md:table-cell">{{ hab.capacidad }} pers.</td>
                    <td class="px-6 py-4 font-semibold text-[#c9a84c]">S/ {{ hab.precioPorNoche }}</td>
                    <td class="px-6 py-4">
                      <app-badge [variant]="getEstadoVariant(hab.estado)" [dot]="true">
                        {{ getEstadoLabel(hab.estado) }}
                      </app-badge>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-end gap-1">
                        <a [routerLink]="['/habitaciones', hab.id]"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Ver detalle">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </a>
                        <a [routerLink]="['/habitaciones', hab.id, 'editar']"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-[#0f2044] hover:bg-slate-100 transition-colors" title="Editar">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class HabitacionesView {
  habitacionesService = inject(HabitacionesService);

  searchQuery = '';
  filterEstado = '';
  filterTipo = '';
  viewMode = signal<'grid' | 'list'>('grid');

  readonly statusStats = [
    { label: 'Disponibles', value: 'disponible', color: 'text-emerald-600', count: this.habitacionesService.disponibles },
    { label: 'Ocupadas', value: 'ocupada', color: 'text-blue-600', count: this.habitacionesService.ocupadas },
    { label: 'Mantenimiento', value: 'mantenimiento', color: 'text-amber-600', count: this.habitacionesService.enMantenimiento },
    { label: 'Total', value: '', color: 'text-slate-700', count: this.habitacionesService.totalHabitaciones },
  ];

  filteredHabitaciones = computed(() => {
    let list = this.habitacionesService.getAll();
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(h =>
        h.numero.toLowerCase().includes(q) ||
        h.tipo.toLowerCase().includes(q)
      );
    }
    if (this.filterEstado) {
      list = list.filter(h => h.estado === this.filterEstado);
    }
    if (this.filterTipo) {
      list = list.filter(h => h.tipo === this.filterTipo);
    }
    return list;
  });

  getEstadoVariant(estado: HabitacionEstado): 'success' | 'info' | 'warning' | 'neutral' {
    const map: Record<HabitacionEstado, 'success' | 'info' | 'warning' | 'neutral'> = {
      disponible: 'success',
      ocupada: 'info',
      mantenimiento: 'warning',
      reservada: 'neutral',
    };
    return map[estado];
  }

  getEstadoLabel(estado: HabitacionEstado): string {
    const map: Record<HabitacionEstado, string> = {
      disponible: 'Disponible',
      ocupada: 'Ocupada',
      mantenimiento: 'Mantenimiento',
      reservada: 'Reservada',
    };
    return map[estado];
  }

  getEstadoColor(estado: HabitacionEstado): string {
    const map: Record<HabitacionEstado, string> = {
      disponible: 'bg-emerald-500',
      ocupada: 'bg-blue-500',
      mantenimiento: 'bg-amber-500',
      reservada: 'bg-purple-500',
    };
    return map[estado];
  }
}
