import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HabitacionesService } from '../../core/services/habitaciones.service';
import { HabitacionTipo, HabitacionEstado } from '../../core/models/habitacion.model';

@Component({
  selector: 'app-habitacion-form-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto space-y-6 animate-fade-in">

      <div class="flex items-center gap-3">
        <a routerLink="/habitaciones"
          class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </a>
        <div>
          <h1 class="text-2xl font-bold text-slate-800">{{ isEdit ? 'Editar Habitación' : 'Nueva Habitación' }}</h1>
          <p class="text-slate-500 text-sm mt-0.5">
            {{ isEdit ? 'Modifica los datos de la habitación' : 'Registra una nueva habitación' }}
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
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Número <span class="text-red-500">*</span></label>
            <input type="text" name="numero" [(ngModel)]="formData.numero" required
              placeholder="Ej: 101"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"/>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Piso <span class="text-red-500">*</span></label>
            <input type="number" name="piso" [(ngModel)]="formData.piso" required min="1"
              placeholder="Ej: 1"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"/>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Tipo <span class="text-red-500">*</span></label>
            <select name="tipo" [(ngModel)]="formData.tipo" required
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] bg-white transition-all">
              <option value="Simple">Simple</option>
              <option value="Doble">Doble</option>
              <option value="Suite">Suite</option>
              <option value="Suite Presidencial">Suite Presidencial</option>
              <option value="Familiar">Familiar</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Capacidad <span class="text-red-500">*</span></label>
            <input type="number" name="capacidad" [(ngModel)]="formData.capacidad" required min="1" max="10"
              placeholder="Ej: 2"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"/>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Precio por Noche (S/) <span class="text-red-500">*</span></label>
            <input type="number" name="precioPorNoche" [(ngModel)]="formData.precioPorNoche" required min="1"
              placeholder="Ej: 200"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"/>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Estado</label>
            <select name="estado" [(ngModel)]="formData.estado"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] bg-white transition-all">
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="reservada">Reservada</option>
            </select>
          </div>

          <div class="flex flex-col gap-1 sm:col-span-2">
            <label class="text-sm font-medium text-slate-700">Descripción</label>
            <textarea name="descripcion" [(ngModel)]="formData.descripcion" rows="3"
              placeholder="Describe la habitación..."
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all resize-none"></textarea>
          </div>

          <div class="flex flex-col gap-1 sm:col-span-2">
            <label class="text-sm font-medium text-slate-700">Amenidades</label>
            <p class="text-xs text-slate-400">Separadas por coma. Ej: WiFi, TV, Aire acondicionado</p>
            <input type="text" name="amenidades" [(ngModel)]="amenidadesStr"
              placeholder="WiFi, TV, Aire acondicionado, Minibar"
              class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2044] transition-all"/>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <a routerLink="/habitaciones"
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
            {{ isEdit ? 'Guardar Cambios' : 'Registrar Habitación' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class HabitacionFormView implements OnInit {
  private habitacionesService = inject(HabitacionesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = false;
  habitacionId: number | null = null;
  loading = signal(false);
  successMsg = signal('');
  amenidadesStr = '';

  formData = {
    numero: '',
    piso: 1,
    tipo: 'Simple' as HabitacionTipo,
    capacidad: 1,
    precioPorNoche: 100,
    estado: 'disponible' as HabitacionEstado,
    descripcion: '',
    amenidades: [] as string[],
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.habitacionId = +id;
      const hab = this.habitacionesService.getById(this.habitacionId);
      if (hab) {
        this.formData = {
          numero: hab.numero,
          piso: hab.piso,
          tipo: hab.tipo,
          capacidad: hab.capacidad,
          precioPorNoche: hab.precioPorNoche,
          estado: hab.estado,
          descripcion: hab.descripcion,
          amenidades: [...hab.amenidades],
        };
        this.amenidadesStr = hab.amenidades.join(', ');
      }
    }
  }

  onSubmit() {
    this.loading.set(true);
    this.formData.amenidades = this.amenidadesStr
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    setTimeout(() => {
      if (this.isEdit && this.habitacionId) {
        this.habitacionesService.update(this.habitacionId, this.formData);
        this.successMsg.set('Habitación actualizada correctamente.');
      } else {
        this.habitacionesService.create(this.formData);
        this.successMsg.set('Habitación registrada correctamente.');
      }
      this.loading.set(false);
      setTimeout(() => this.router.navigate(['/habitaciones']), 1200);
    }, 700);
  }
}
