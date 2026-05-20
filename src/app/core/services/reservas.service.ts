import { Injectable, signal, computed } from '@angular/core';
import { Reserva, ReservaEstado } from '../models/reserva.model';
import { RESERVAS_MOCK } from '../data/reservas.mock';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private _reservas = signal<Reserva[]>([...RESERVAS_MOCK]);

  readonly reservas = this._reservas.asReadonly();
  readonly totalReservas = computed(() => this._reservas().length);
  readonly reservasActivas = computed(() =>
    this._reservas().filter(r => r.estado === 'confirmada' || r.estado === 'en_curso').length
  );
  readonly ingresosTotales = computed(() =>
    this._reservas()
      .filter(r => r.estado !== 'cancelada')
      .reduce((sum, r) => sum + r.precioTotal, 0)
  );

  getAll(): Reserva[] {
    return this._reservas();
  }

  getById(id: number): Reserva | undefined {
    return this._reservas().find(r => r.id === id);
  }

  getByCliente(clienteId: number): Reserva[] {
    return this._reservas().filter(r => r.clienteId === clienteId);
  }

  create(reserva: Omit<Reserva, 'id' | 'codigo' | 'fechaCreacion'>): Reserva {
    const newId = Math.max(...this._reservas().map(r => r.id)) + 1;
    const newReserva: Reserva = {
      ...reserva,
      id: newId,
      codigo: `RES-2026-${String(newId).padStart(3, '0')}`,
      fechaCreacion: new Date().toISOString().split('T')[0],
    };
    this._reservas.update(list => [...list, newReserva]);
    return newReserva;
  }

  update(id: number, changes: Partial<Reserva>): boolean {
    const idx = this._reservas().findIndex(r => r.id === id);
    if (idx === -1) return false;
    this._reservas.update(list => {
      const updated = [...list];
      updated[idx] = { ...updated[idx], ...changes };
      return updated;
    });
    return true;
  }

  cancelar(id: number): void {
    this.update(id, { estado: 'cancelada' });
  }

  cambiarEstado(id: number, estado: ReservaEstado): void {
    this.update(id, { estado });
  }

  filterByEstado(estado: ReservaEstado): Reserva[] {
    return this._reservas().filter(r => r.estado === estado);
  }
}
