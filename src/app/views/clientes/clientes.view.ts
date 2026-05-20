import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../core/services/clientes.service';
import { Cliente } from '../../core/models/cliente.model';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-clientes-view',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BadgeComponent],
  template: `
    <div class="space-y-6 animate-fade-in">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Clientes</h1>
          <p class="text-slate-500 text-sm mt-0.5">
            {{ clientesService.totalClientes() }} clientes registrados ·
            <span class="text-emerald-600">{{ clientesService.clientesActivos() }} activos</span>
          </p>
        </div>
        <a
          routerLink="/clientes/nuevo"
          class="inline-flex items-center gap-2 bg-[#0f2044] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3260] transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Cliente
        </a>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
              </svg>
            </span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Buscar por nombre, email o documento..."
              class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"
            />
          </div>
          <select
            [(ngModel)]="filterEstado"
            class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Documento</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Teléfono</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Reservas</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (cliente of filteredClientes(); track cliente.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-[#0f2044] flex items-center justify-center flex-shrink-0">
                        <span class="text-white text-xs font-bold">
                          {{ cliente.nombre.charAt(0) }}{{ cliente.apellido.charAt(0) }}
                        </span>
                      </div>
                      <div>
                        <p class="font-medium text-slate-800">{{ cliente.nombre }} {{ cliente.apellido }}</p>
                        <p class="text-xs text-slate-400">{{ cliente.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <p class="text-slate-600">{{ cliente.documento }}</p>
                    <p class="text-xs text-slate-400">{{ cliente.tipoDocumento }}</p>
                  </td>
                  <td class="px-6 py-4 text-slate-600 hidden lg:table-cell">{{ cliente.telefono }}</td>
                  <td class="px-6 py-4 hidden sm:table-cell">
                    <span class="inline-flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                      {{ cliente.totalReservas }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <app-badge [variant]="cliente.estado === 'activo' ? 'success' : 'neutral'" [dot]="true">
                      {{ cliente.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                    </app-badge>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-1">
                      <a
                        [routerLink]="['/clientes', cliente.id, 'editar']"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-[#0f2044] hover:bg-slate-100 transition-colors"
                        title="Editar"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </a>
                      <button
                        (click)="toggleEstado(cliente)"
                        [title]="cliente.estado === 'activo' ? 'Desactivar' : 'Activar'"
                        class="p-1.5 rounded-lg transition-colors"
                        [class]="cliente.estado === 'activo'
                          ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                          : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'"
                      >
                        @if (cliente.estado === 'activo') {
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                          </svg>
                        } @else {
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center gap-2">
                      <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <p class="text-slate-500 text-sm">No se encontraron clientes</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p class="text-xs text-slate-500">
            Mostrando {{ filteredClientes().length }} de {{ clientesService.totalClientes() }} clientes
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ClientesView {
  clientesService = inject(ClientesService);

  searchQuery = '';
  filterEstado = '';

  filteredClientes = computed(() => {
    let list = this.clientesService.getAll();
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(c =>
        c.nombre.toLowerCase().includes(q) ||
        c.apellido.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.documento.includes(q)
      );
    }
    if (this.filterEstado) {
      list = list.filter(c => c.estado === this.filterEstado);
    }
    return list;
  });

  toggleEstado(cliente: Cliente) {
    this.clientesService.toggleEstado(cliente.id);
  }
}
