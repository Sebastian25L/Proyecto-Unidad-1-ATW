import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClientesService } from '../../core/services/clientes.service';
import { Cliente } from '../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-form-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto space-y-6 animate-fade-in">

      <div class="flex items-center gap-3">
        <a
          routerLink="/clientes"
          class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </a>
        <div>
          <h1 class="text-2xl font-bold text-slate-800">{{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}</h1>
          <p class="text-slate-500 text-sm mt-0.5">
            {{ isEdit ? 'Modifica los datos del cliente' : 'Registra un nuevo cliente en el sistema' }}
          </p>
        </div>
      </div>

      @if (successMsg()) {
        <div class="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg animate-fade-in">
          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          {{ successMsg() }}
        </div>
      }

      <form (ngSubmit)="onSubmit()" #form="ngForm" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <!-- Nombre -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Nombre <span class="text-red-500">*</span></label>
            <input
              type="text" name="nombre" [(ngModel)]="formData.nombre" required
              placeholder="Ej: Carlos"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Apellido <span class="text-red-500">*</span></label>
            <input
              type="text" name="apellido" [(ngModel)]="formData.apellido" required
              placeholder="Ej: Mendoza"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"
            />
          </div>

          <div class="flex flex-col gap-1 sm:col-span-2">
            <label class="text-sm font-medium text-slate-700">Correo electrónico <span class="text-red-500">*</span></label>
            <input
              type="email" name="email" [(ngModel)]="formData.email" required
              placeholder="correo@ejemplo.com"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Teléfono</label>
            <input
              type="tel" name="telefono" [(ngModel)]="formData.telefono"
              placeholder="+51 987 654 321"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Nacionalidad</label>
            <input
              type="text" name="nacionalidad" [(ngModel)]="formData.nacionalidad"
              placeholder="Ej: Peruana"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Tipo de Documento <span class="text-red-500">*</span></label>
            <select
              name="tipoDocumento" [(ngModel)]="formData.tipoDocumento" required
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] bg-white transition-all"
            >
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="RUC">RUC</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Número de Documento <span class="text-red-500">*</span></label>
            <input
              type="text" name="documento" [(ngModel)]="formData.documento" required
              placeholder="Ej: 45678901"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"
            />
          </div>

          @if (isEdit) {
            <div class="flex flex-col gap-1 sm:col-span-2">
              <label class="text-sm font-medium text-slate-700">Estado</label>
              <select
                name="estado" [(ngModel)]="formData.estado"
                class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] bg-white transition-all"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          }
        </div>

        <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <a
            routerLink="/clientes"
            class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </a>
          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0f2044] rounded-lg hover:bg-[#1a3260] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            @if (loading()) {
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            }
            {{ isEdit ? 'Guardar Cambios' : 'Registrar Cliente' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ClienteFormView implements OnInit {
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = false;
  clienteId: number | null = null;
  loading = signal(false);
  successMsg = signal('');

  formData = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    documento: '',
    tipoDocumento: 'DNI' as 'DNI' | 'Pasaporte' | 'RUC',
    nacionalidad: '',
    estado: 'activo' as 'activo' | 'inactivo',
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.clienteId = +id;
      const cliente = this.clientesService.getById(this.clienteId);
      if (cliente) {
        this.formData = {
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          email: cliente.email,
          telefono: cliente.telefono,
          documento: cliente.documento,
          tipoDocumento: cliente.tipoDocumento,
          nacionalidad: cliente.nacionalidad,
          estado: cliente.estado,
        };
      }
    }
  }

  onSubmit() {
    this.loading.set(true);
    setTimeout(() => {
      if (this.isEdit && this.clienteId) {
        this.clientesService.update(this.clienteId, this.formData);
        this.successMsg.set('Cliente actualizado correctamente.');
      } else {
        this.clientesService.create(this.formData);
        this.successMsg.set('Cliente registrado correctamente.');
      }
      this.loading.set(false);
      setTimeout(() => this.router.navigate(['/clientes']), 1200);
    }, 700);
  }
}
