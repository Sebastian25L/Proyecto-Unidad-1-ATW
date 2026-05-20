import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservasService } from '../../core/services/reservas.service';
import { Reserva, ReservaEstado } from '../../core/models/reserva.model';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-agenda-view',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent],
  template: `
    <div class="space-y-6 animate-fade-in">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Agenda de Reservas</h1>
          <p class="text-slate-500 text-sm mt-0.5">Vista de calendario y reservas del mes</p>
        </div>
        <a routerLink="/reservas/nueva"
          class="inline-flex items-center gap-2 bg-[#0f2044] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3260] transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Reserva
        </a>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <button (click)="prevMonth()"
              class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <h3 class="text-base font-semibold text-slate-800">{{ monthLabel() }}</h3>
            <button (click)="nextMonth()"
              class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-7 mb-2">
            @for (day of dayNames; track day) {
              <div class="text-center text-xs font-semibold text-slate-400 py-1">{{ day }}</div>
            }
          </div>

          <div class="grid grid-cols-7 gap-1">
            @for (cell of calendarCells(); track $index) {
              <div
                (click)="cell.day ? selectDay(cell.day) : null"
                [class]="'min-h-[52px] rounded-lg p-1 transition-all ' +
                  (cell.day
                    ? 'cursor-pointer hover:bg-slate-50 ' +
                      (isToday(cell.day) ? 'ring-2 ring-[#c9a84c] bg-amber-50' : '') +
                      (selectedDay() === cell.day ? ' bg-[#0f2044]/5' : '')
                    : 'opacity-0 pointer-events-none')"
              >
                @if (cell.day) {
                  <p [class]="'text-xs font-medium text-center mb-1 w-6 h-6 flex items-center justify-center rounded-full mx-auto ' +
                    (isToday(cell.day) ? 'bg-[#c9a84c] text-white' : 'text-slate-600')">
                    {{ cell.day }}
                  </p>
                  @for (r of getReservasForDay(cell.day); track r.id) {
                    <div [class]="'text-xs px-1 py-0.5 rounded mb-0.5 truncate ' + getEstadoCalendarClass(r.estado)"
                      [title]="r.clienteNombre">
                      {{ r.clienteNombre.split(' ')[0] }}
                    </div>
                  }
                }
              </div>
            }
          </div>

          <div class="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100">
            @for (item of legend; track item.label) {
              <div class="flex items-center gap-1.5">
                <div [class]="'w-3 h-3 rounded ' + item.color"></div>
                <span class="text-xs text-slate-500">{{ item.label }}</span>
              </div>
            }
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div class="px-5 py-4 border-b border-slate-100">
            <h3 class="text-sm font-semibold text-slate-800">
              @if (selectedDay()) {
                Reservas del {{ selectedDay() }} de {{ monthLabel() }}
              } @else {
                Próximas Reservas
              }
            </h3>
          </div>
          <div class="p-4 space-y-3 overflow-y-auto max-h-[500px]">
            @for (r of sidebarReservas(); track r.id) {
              <div class="border border-slate-100 rounded-lg p-3 hover:border-slate-200 transition-colors">
                <div class="flex items-start justify-between gap-2 mb-2">
                  <p class="text-sm font-semibold text-slate-800 leading-tight">{{ r.clienteNombre }}</p>
                  <app-badge [variant]="getEstadoVariant(r.estado)">
                    {{ getEstadoLabel(r.estado) }}
                  </app-badge>
                </div>
                <p class="text-xs text-slate-500 mb-1">
                  <span class="font-medium">Hab. {{ r.habitacionNumero }}</span> · {{ r.habitacionTipo }}
                </p>
                <p class="text-xs text-slate-400">
                  {{ r.fechaIngreso }} → {{ r.fechaSalida }}
                  <span class="text-slate-500 font-medium">({{ r.noches }} noches)</span>
                </p>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs font-bold text-[#c9a84c]">S/ {{ r.precioTotal.toLocaleString() }}</span>
                  <a [routerLink]="['/reservas', r.id, 'editar']"
                    class="text-xs text-[#0f2044] font-medium hover:underline">Editar →</a>
                </div>
              </div>
            } @empty {
              <div class="py-8 text-center">
                <svg class="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p class="text-slate-400 text-xs">Sin reservas para este día</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AgendaView {
  private reservasService = inject(ReservasService);

  today = new Date();
  currentYear = signal(this.today.getFullYear());
  currentMonth = signal(this.today.getMonth()); // 0-indexed
  selectedDay = signal<number | null>(null);

  readonly dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  readonly legend = [
    { label: 'Confirmada', color: 'bg-emerald-400' },
    { label: 'En Curso', color: 'bg-blue-400' },
    { label: 'Pendiente', color: 'bg-amber-400' },
    { label: 'Cancelada', color: 'bg-red-300' },
  ];

  monthLabel = computed(() => {
    return new Date(this.currentYear(), this.currentMonth(), 1)
      .toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
  });

  calendarCells = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: { day: number | null }[] = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
    return cells;
  });

  sidebarReservas = computed(() => {
    const day = this.selectedDay();
    const year = this.currentYear();
    const month = this.currentMonth();
    const all = this.reservasService.getAll();
    if (day) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return all.filter(r => r.fechaIngreso <= dateStr && r.fechaSalida > dateStr);
    }
    return all
      .filter(r => r.estado !== 'cancelada' && r.estado !== 'completada')
      .sort((a, b) => a.fechaIngreso.localeCompare(b.fechaIngreso))
      .slice(0, 8);
  });

  getReservasForDay(day: number): Reserva[] {
    const year = this.currentYear();
    const month = this.currentMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return this.reservasService.getAll()
      .filter(r => r.fechaIngreso <= dateStr && r.fechaSalida > dateStr && r.estado !== 'cancelada')
      .slice(0, 2);
  }

  isToday(day: number): boolean {
    return (
      day === this.today.getDate() &&
      this.currentMonth() === this.today.getMonth() &&
      this.currentYear() === this.today.getFullYear()
    );
  }

  selectDay(day: number) {
    this.selectedDay.set(this.selectedDay() === day ? null : day);
  }

  prevMonth() {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update(y => y - 1);
    } else {
      this.currentMonth.update(m => m - 1);
    }
    this.selectedDay.set(null);
  }

  nextMonth() {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update(y => y + 1);
    } else {
      this.currentMonth.update(m => m + 1);
    }
    this.selectedDay.set(null);
  }

  getEstadoCalendarClass(estado: ReservaEstado): string {
    const map: Record<ReservaEstado, string> = {
      confirmada: 'bg-emerald-100 text-emerald-700',
      en_curso: 'bg-blue-100 text-blue-700',
      pendiente: 'bg-amber-100 text-amber-700',
      completada: 'bg-slate-100 text-slate-600',
      cancelada: 'bg-red-100 text-red-500',
    };
    return map[estado];
  }

  getEstadoVariant(estado: ReservaEstado): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    const map: Record<ReservaEstado, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
      confirmada: 'success', en_curso: 'info', pendiente: 'warning', completada: 'neutral', cancelada: 'danger',
    };
    return map[estado];
  }

  getEstadoLabel(estado: ReservaEstado): string {
    const map: Record<ReservaEstado, string> = {
      confirmada: 'Confirmada', en_curso: 'En Curso', pendiente: 'Pendiente', completada: 'Completada', cancelada: 'Cancelada',
    };
    return map[estado];
  }
}
