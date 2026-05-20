import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReservasService } from '../../core/services/reservas.service';
import { ClientesService } from '../../core/services/clientes.service';
import { HabitacionesService } from '../../core/services/habitaciones.service';
import { ReservaEstado } from '../../core/models/reserva.model';

@Component({
  selector: 'app-reserva-form-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto space-y-6 animate-fade-in">

      <div class="flex items-center gap-3">
        <a routerLink="/reservas"
          class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </a>
        <div>
          <h1 class="text-2xl font-bold text-slate-800">{{ isEdit ? 'Editar Reserva' : 'Nueva Reserva' }}</h1>
          <p class="text-slate-500 text-sm mt-0.5">
            {{ isEdit ? 'Modifica los datos de la reserva' : 'Crea una nueva reserva hotelera' }}
          </p>
        </div>
      </div>

      @if (successMsg()) {
        <div class="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg animate-fade-in">
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          {{ successMsg() }}
        </div>
      }

      <form (ngSubmit)="onSubmit()" #form="ngForm" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div class="flex flex-col gap-1 sm:col-span-2">
            <label class="text-sm font-medium text-slate-700">Cliente <span class="text-red-500">*</span></label>
            <select name="clienteId" [(ngModel)]="formData.clienteId" required
              (ngModelChange)="onClienteChange($event)"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] bg-white transition-all">
              <option value="">Selecciona un cliente</option>
              @for (c of clientesActivos(); track c.id) {
                <option [value]="c.id">{{ c.nombre }} {{ c.apellido }} - {{ c.documento }}</option>
              }
            </select>
          </div>

          <div class="flex flex-col gap-1 sm:col-span-2">
            <label class="text-sm font-medium text-slate-700">Habitacion <span class="text-red-500">*</span></label>
            <select name="habitacionId" [(ngModel)]="formData.habitacionId" required
              (ngModelChange)="onHabitacionChange($event)"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] bg-white transition-all">
              <option value="">Selecciona una habitacion</option>
              @for (h of habitacionesDisponibles(); track h.id) {
                <option [value]="h.id">Hab. {{ h.numero }} - {{ h.tipo }} - S/ {{ h.precioPorNoche }}/noche</option>
              }
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Fecha de Ingreso <span class="text-red-500">*</span></label>
            <input type="date" name="fechaIngreso" [(ngModel)]="formData.fechaIngreso" required
              (ngModelChange)="calcularNoches()"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"/>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Fecha de Salida <span class="text-red-500">*</span></label>
            <input type="date" name="fechaSalida" [(ngModel)]="formData.fechaSalida" required
              (ngModelChange)="calcularNoches()"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"/>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Estado</label>
            <select name="estado" [(ngModel)]="formData.estado"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] bg-white transition-all">
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="en_curso">En Curso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          @if (formData.noches > 0 && precioPorNoche > 0) {
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-slate-700">Resumen</label>
              <div class="bg-[#0f2044]/5 border border-[#0f2044]/10 rounded-lg px-3 py-2">
                <p class="text-xs text-slate-500">{{ formData.noches }} noche{{ formData.noches > 1 ? 's' : '' }} x S/ {{ precioPorNoche }}</p>
                <p class="text-lg font-bold text-[#c9a84c]">S/ {{ formData.precioTotal.toLocaleString() }}</p>
              </div>
            </div>
          }

          <div class="flex flex-col gap-1 sm:col-span-2">
            <label class="text-sm font-medium text-slate-700">Observaciones</label>
            <textarea name="observaciones" [(ngModel)]="formData.observaciones" rows="3"
              placeholder="Notas adicionales sobre la reserva..."
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all resize-none"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <a routerLink="/reservas"
            class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            Cancelar
          </a>
          <button type="submit" [disabled]="form.invalid || loading()"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0f2044] rounded-lg hover:bg-[#1a3260] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            @if (loading()) {
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            }
            {{ isEdit ? 'Guardar Cambios' : 'Crear Reserva' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ReservaFormView implements OnInit {
  private reservasService = inject(ReservasService);
  private clientesService = inject(ClientesService);
  private habitacionesService = inject(HabitacionesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = false;
  reservaId: number | null = null;
  loading = signal(false);
  successMsg = signal('');
  precioPorNoche = 0;

  formData = {
    clienteId: 0,
    clienteNombre: '',
    habitacionId: 0,
    habitacionNumero: '',
    habitacionTipo: '',
    fechaIngreso: '',
    fechaSalida: '',
    noches: 0,
    precioTotal: 0,
    estado: 'pendiente' as ReservaEstado,
    observaciones: '',
  };

  clientesActivos = computed(() => this.clientesService.getAll().filter(c => c.estado === 'activo'));
  habitacionesDisponibles = computed(() => this.habitacionesService.getAll().filter(h => h.estado === 'disponible' || h.estado === 'reservada'));

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.reservaId = +id;
      const r = this.reservasService.getById(this.reservaId);
      if (r) {
        this.formData = {
          clienteId: r.clienteId,
          clienteNombre: r.clienteNombre,
          habitacionId: r.habitacionId,
          habitacionNumero: r.habitacionNumero,
          habitacionTipo: r.habitacionTipo,
          fechaIngreso: r.fechaIngreso,
          fechaSalida: r.fechaSalida,
          noches: r.noches,
          precioTotal: r.precioTotal,
          estado: r.estado,
          observaciones: r.observaciones ?? '',
        };
        const hab = this.habitacionesService.getById(r.habitacionId);
        if (hab) this.precioPorNoche = hab.precioPorNoche;
      }
    }
  }

  onClienteChange(id: number) {
    const c = this.clientesService.getById(+id);
    if (c) this.formData.clienteNombre = `${c.nombre} ${c.apellido}`;
  }

  onHabitacionChange(id: number) {
    const h = this.habitacionesService.getById(+id);
    if (h) {
      this.formData.habitacionNumero = h.numero;
      this.formData.habitacionTipo = h.tipo;
      this.precioPorNoche = h.precioPorNoche;
      this.calcularNoches();
    }
  }

  calcularNoches() {
    if (this.formData.fechaIngreso && this.formData.fechaSalida) {
      const ingreso = new Date(this.formData.fechaIngreso);
      const salida = new Date(this.formData.fechaSalida);
      const diff = Math.ceil((salida.getTime() - ingreso.getTime()) / (1000 * 60 * 60 * 24));
      this.formData.noches = diff > 0 ? diff : 0;
      this.formData.precioTotal = this.formData.noches * this.precioPorNoche;
    }
  }

  onSubmit() {
    this.loading.set(true);
    setTimeout(() => {
      if (this.isEdit && this.reservaId) {
        this.reservasService.update(this.reservaId, this.formData);
        this.successMsg.set('Reserva actualizada correctamente.');
      } else {
        this.reservasService.create(this.formData);
        this.successMsg.set('Reserva creada correctamente.');
      }
      this.loading.set(false);
      setTimeout(() => this.router.navigate(['/reservas']), 1200);
    }, 700);
  }
}
