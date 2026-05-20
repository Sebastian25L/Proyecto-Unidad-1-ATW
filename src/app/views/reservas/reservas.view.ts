import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../core/services/reservas.service';
import { Reserva, ReservaEstado } from '../../core/models/reserva.model';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-reservas-view',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BadgeComponent, ModalComponent],
  template: `
    <div class="space-y-6 animate-fade-in">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Reservas</h1>
          <p class="text-slate-500 text-sm mt-0.5">
            {{ reservasService.totalReservas() }} reservas ·
            <span class="text-emerald-600">{{ reservasService.reservasActivas() }} activas</span>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <a routerLink="/agenda"
            class="inline-flex items-center gap-2 bg-white text-[#0f2044] border border-[#0f2044] px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Agenda
          </a>
          <a routerLink="/reservas/nueva"
            class="inline-flex items-center gap-2 bg-[#0f2044] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3260] transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nueva Reserva
          </a>
        </div>
      </div>

      <div class="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
        @for (tab of statusTabs; track tab.value) {
          <button
            (click)="activeTab = tab.value"
            [class]="'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ' +
              (activeTab === tab.value
                ? 'bg-[#0f2044] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50')"
          >
            {{ tab.label }}
            <span [class]="'px-1.5 py-0.5 rounded-full text-xs font-bold ' +
              (activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600')">
              {{ tab.count() }}
            </span>
          </button>
        }
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
            </svg>
          </span>
          <input type="text" [(ngModel)]="searchQuery"
            placeholder="Buscar por codigo, cliente o habitacion..."
            class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"/>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Codigo</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Habitacion</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Fechas</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Total</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (r of filteredReservas(); track r.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4">
                    <span class="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{{ r.codigo }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <p class="font-medium text-slate-800">{{ r.clienteNombre }}</p>
                    <p class="text-xs text-slate-400">{{ r.noches }} noche{{ r.noches > 1 ? 's' : '' }}</p>
                  </td>
                  <td class="px-6 py-4 hidden sm:table-cell">
                    <p class="text-slate-700 font-medium">Hab. {{ r.habitacionNumero }}</p>
                    <p class="text-xs text-slate-400">{{ r.habitacionTipo }}</p>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <p class="text-slate-600 text-xs">{{ r.fechaIngreso }}</p>
                    <p class="text-slate-400 text-xs">{{ r.fechaSalida }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <app-badge [variant]="getEstadoVariant(r.estado)" [dot]="true">
                      {{ getEstadoLabel(r.estado) }}
                    </app-badge>
                  </td>
                  <td class="px-6 py-4 text-right font-semibold text-slate-700 hidden lg:table-cell">
                    S/ {{ r.precioTotal.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-1">
                      <a [routerLink]="['/reservas', r.id, 'editar']"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-[#0f2044] hover:bg-slate-100 transition-colors" title="Editar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </a>
                      @if (r.estado !== 'cancelada' && r.estado !== 'completada') {
                        <button (click)="confirmarCancelacion(r)"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Cancelar">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center gap-2">
                      <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <p class="text-slate-500 text-sm">No se encontraron reservas</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p class="text-xs text-slate-500">
            Mostrando {{ filteredReservas().length }} reservas
          </p>
          <p class="text-xs font-semibold text-slate-700">
            Total: S/ {{ totalFiltrado().toLocaleString() }}
          </p>
        </div>
      </div>

      <app-modal
        [isOpen]="showCancelModal()"
        title="Cancelar Reserva"
        size="sm"
        (close)="showCancelModal.set(false)"
      >
        <div class="space-y-3">
          <p class="text-sm text-slate-600">
            Estas seguro de que deseas cancelar la reserva
            <span class="font-semibold text-slate-800">{{ reservaACancelar()?.codigo }}</span>?
          </p>
          <p class="text-xs text-slate-400">Esta accion no se puede deshacer.</p>
        </div>
        <div footer class="flex gap-3">
          <button (click)="showCancelModal.set(false)"
            class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            No, mantener
          </button>
          <button (click)="cancelarReserva()"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
            Si, cancelar
          </button>
        </div>
      </app-modal>
    </div>
  `,
})
export class ReservasView {
  reservasService = inject(ReservasService);

  searchQuery = '';
  activeTab = '';
  showCancelModal = signal(false);
  reservaACancelar = signal<Reserva | null>(null);

  readonly statusTabs = [
    { label: 'Todas', value: '', count: this.reservasService.totalReservas },
    { label: 'Pendientes', value: 'pendiente', count: () => this.reservasService.filterByEstado('pendiente').length },
    { label: 'Confirmadas', value: 'confirmada', count: () => this.reservasService.filterByEstado('confirmada').length },
    { label: 'En Curso', value: 'en_curso', count: () => this.reservasService.filterByEstado('en_curso').length },
    { label: 'Completadas', value: 'completada', count: () => this.reservasService.filterByEstado('completada').length },
    { label: 'Canceladas', value: 'cancelada', count: () => this.reservasService.filterByEstado('cancelada').length },
  ];

  filteredReservas = computed(() => {
    let list = this.reservasService.getAll();
    if (this.activeTab) {
      list = list.filter(r => r.estado === this.activeTab);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(r =>
        r.codigo.toLowerCase().includes(q) ||
        r.clienteNombre.toLowerCase().includes(q) ||
        r.habitacionNumero.includes(q)
      );
    }
    return list;
  });

  totalFiltrado = computed(() =>
    this.filteredReservas()
      .filter(r => r.estado !== 'cancelada')
      .reduce((sum, r) => sum + r.precioTotal, 0)
  );

  confirmarCancelacion(r: Reserva) {
    this.reservaACancelar.set(r);
    this.showCancelModal.set(true);
  }

  cancelarReserva() {
    const r = this.reservaACancelar();
    if (r) {
      this.reservasService.cancelar(r.id);
    }
    this.showCancelModal.set(false);
    this.reservaACancelar.set(null);
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
