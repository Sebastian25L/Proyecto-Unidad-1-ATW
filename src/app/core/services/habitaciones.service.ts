import { Injectable, signal, computed } from '@angular/core';
import { Habitacion, HabitacionEstado } from '../models/habitacion.model';
import { HABITACIONES_MOCK } from '../data/habitaciones.mock';

@Injectable({ providedIn: 'root' })
export class HabitacionesService {
  private _habitaciones = signal<Habitacion[]>([...HABITACIONES_MOCK]);

  readonly habitaciones = this._habitaciones.asReadonly();
  readonly totalHabitaciones = computed(() => this._habitaciones().length);
  readonly disponibles = computed(() => this._habitaciones().filter(h => h.estado === 'disponible').length);
  readonly ocupadas = computed(() => this._habitaciones().filter(h => h.estado === 'ocupada').length);
  readonly enMantenimiento = computed(() => this._habitaciones().filter(h => h.estado === 'mantenimiento').length);

  getAll(): Habitacion[] {
    return this._habitaciones();
  }

  getById(id: number): Habitacion | undefined {
    return this._habitaciones().find(h => h.id === id);
  }

  getDisponibles(): Habitacion[] {
    return this._habitaciones().filter(h => h.estado === 'disponible');
  }

  create(habitacion: Omit<Habitacion, 'id'>): Habitacion {
    const newHab: Habitacion = {
      ...habitacion,
      id: Math.max(...this._habitaciones().map(h => h.id)) + 1,
    };
    this._habitaciones.update(list => [...list, newHab]);
    return newHab;
  }

  update(id: number, changes: Partial<Habitacion>): boolean {
    const idx = this._habitaciones().findIndex(h => h.id === id);
    if (idx === -1) return false;
    this._habitaciones.update(list => {
      const updated = [...list];
      updated[idx] = { ...updated[idx], ...changes };
      return updated;
    });
    return true;
  }

  cambiarEstado(id: number, estado: HabitacionEstado): void {
    this.update(id, { estado });
  }

  filterByEstado(estado: HabitacionEstado): Habitacion[] {
    return this._habitaciones().filter(h => h.estado === estado);
  }
}
