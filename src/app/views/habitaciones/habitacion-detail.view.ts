import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HabitacionesService } from '../../core/services/habitaciones.service';
import { Habitacion, HabitacionEstado } from '../../core/models/habitacion.model';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-habitacion-detail-view',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent],
  template: `
    <div class="max-w-3xl mx-auto space-y-6 animate-fade-in">

      <div class="flex items-center gap-3">
        <a routerLink="/habitaciones"
          class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </a>
        <h1 class="text-2xl font-bold text-slate-800">Detalle de Habitación</h1>
      </div>

      @if (habitacion()) {
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Status bar -->
          <div [class]="'h-3 ' + getEstadoColor(habitacion()!.estado)"></div>

          <div class="p-6">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <h2 class="text-3xl font-bold text-slate-800">Habitación {{ habitacion()!.numero }}</h2>
                  <app-badge [variant]="getEstadoVariant(habitacion()!.estado)" [dot]="true">
                    {{ getEstadoLabel(habitacion()!.estado) }}
                  </app-badge>
                </div>
                <p class="text-slate-500">{{ habitacion()!.tipo }} · Piso {{ habitacion()!.piso }}</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-[#c9a84c]">S/ {{ habitacion()!.precioPorNoche }}</p>
                <p class="text-xs text-slate-400">por noche</p>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-xs text-slate-500 mb-1">Tipo</p>
                <p class="font-semibold text-slate-800 text-sm">{{ habitacion()!.tipo }}</p>
              </div>
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-xs text-slate-500 mb-1">Capacidad</p>
                <p class="font-semibold text-slate-800 text-sm">{{ habitacion()!.capacidad }} persona{{ habitacion()!.capacidad > 1 ? 's' : '' }}</p>
              </div>
              <div class="bg-slate-50 rounded-lg p-3">
                <p class="text-xs text-slate-500 mb-1">Piso</p>
                <p class="font-semibold text-slate-800 text-sm">Piso {{ habitacion()!.piso }}</p>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="text-sm font-semibold text-slate-700 mb-2">Descripción</h3>
              <p class="text-sm text-slate-600 leading-relaxed">{{ habitacion()!.descripcion }}</p>
            </div>

            <div class="mb-6">
              <h3 class="text-sm font-semibold text-slate-700 mb-3">Amenidades</h3>
              <div class="flex flex-wrap gap-2">
                @for (amenidad of habitacion()!.amenidades; track amenidad) {
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0f2044]/5 text-[#0f2044] text-xs font-medium rounded-full border border-[#0f2044]/10">
                    <svg class="w-3 h-3 text-[#c9a84c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    {{ amenidad }}
                  </span>
                }
              </div>
            </div>

            <div class="border-t border-slate-100 pt-5">
              <h3 class="text-sm font-semibold text-slate-700 mb-3">Cambiar Estado</h3>
              <div class="flex flex-wrap gap-2">
                @for (estado of estados; track estado.value) {
                  <button
                    (click)="cambiarEstado(estado.value)"
                    [disabled]="habitacion()!.estado === estado.value"
                    [class]="'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ' +
                      (habitacion()!.estado === estado.value
                        ? 'opacity-50 cursor-not-allowed ' + estado.activeClass
                        : estado.class)"
                  >
                    {{ estado.label }}
                  </button>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3">
          <a
            routerLink="/habitaciones"
            class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Volver
          </a>
          <a
            [routerLink]="['/habitaciones', habitacion()!.id, 'editar']"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0f2044] rounded-lg hover:bg-[#1a3260] transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Editar Habitación
          </a>
        </div>
      } @else {
        <div class="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p class="text-slate-400">Habitación no encontrada.</p>
          <a routerLink="/habitaciones" class="text-[#0f2044] text-sm font-medium hover:underline mt-2 inline-block">
            Volver al listado
          </a>
        </div>
      }
    </div>
  `,
})
export class HabitacionDetailView implements OnInit {
  private habitacionesService = inject(HabitacionesService);
  private route = inject(ActivatedRoute);

  habitacion = signal<Habitacion | undefined>(undefined);

  readonly estados: { value: HabitacionEstado; label: string; class: string; activeClass: string }[] = [
    { value: 'disponible', label: 'Disponible', class: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50', activeClass: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
    { value: 'ocupada', label: 'Ocupada', class: 'border-blue-300 text-blue-700 hover:bg-blue-50', activeClass: 'bg-blue-100 border-blue-300 text-blue-700' },
    { value: 'mantenimiento', label: 'Mantenimiento', class: 'border-amber-300 text-amber-700 hover:bg-amber-50', activeClass: 'bg-amber-100 border-amber-300 text-amber-700' },
    { value: 'reservada', label: 'Reservada', class: 'border-purple-300 text-purple-700 hover:bg-purple-50', activeClass: 'bg-purple-100 border-purple-300 text-purple-700' },
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.habitacion.set(this.habitacionesService.getById(+id));
    }
  }

  cambiarEstado(estado: HabitacionEstado) {
    const hab = this.habitacion();
    if (hab) {
      this.habitacionesService.cambiarEstado(hab.id, estado);
      this.habitacion.set(this.habitacionesService.getById(hab.id));
    }
  }

  getEstadoVariant(estado: HabitacionEstado): 'success' | 'info' | 'warning' | 'neutral' {
    const map: Record<HabitacionEstado, 'success' | 'info' | 'warning' | 'neutral'> = {
      disponible: 'success', ocupada: 'info', mantenimiento: 'warning', reservada: 'neutral',
    };
    return map[estado];
  }

  getEstadoLabel(estado: HabitacionEstado): string {
    const map: Record<HabitacionEstado, string> = {
      disponible: 'Disponible', ocupada: 'Ocupada', mantenimiento: 'Mantenimiento', reservada: 'Reservada',
    };
    return map[estado];
  }

  getEstadoColor(estado: HabitacionEstado): string {
    const map: Record<HabitacionEstado, string> = {
      disponible: 'bg-emerald-500', ocupada: 'bg-blue-500', mantenimiento: 'bg-amber-500', reservada: 'bg-purple-500',
    };
    return map[estado];
  }
}
