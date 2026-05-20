import { Injectable, signal, computed } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { CLIENTES_MOCK } from '../data/clientes.mock';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private _clientes = signal<Cliente[]>([...CLIENTES_MOCK]);

  readonly clientes = this._clientes.asReadonly();
  readonly totalClientes = computed(() => this._clientes().length);
  readonly clientesActivos = computed(() => this._clientes().filter(c => c.estado === 'activo').length);

  getAll(): Cliente[] {
    return this._clientes();
  }

  getById(id: number): Cliente | undefined {
    return this._clientes().find(c => c.id === id);
  }

  create(cliente: Omit<Cliente, 'id' | 'fechaRegistro' | 'totalReservas'>): Cliente {
    const newCliente: Cliente = {
      ...cliente,
      id: Math.max(...this._clientes().map(c => c.id)) + 1,
      fechaRegistro: new Date().toISOString().split('T')[0],
      totalReservas: 0,
    };
    this._clientes.update(list => [...list, newCliente]);
    return newCliente;
  }

  update(id: number, changes: Partial<Cliente>): boolean {
    const idx = this._clientes().findIndex(c => c.id === id);
    if (idx === -1) return false;
    this._clientes.update(list => {
      const updated = [...list];
      updated[idx] = { ...updated[idx], ...changes };
      return updated;
    });
    return true;
  }

  toggleEstado(id: number): void {
    const cliente = this._clientes().find(c => c.id === id);
    if (cliente) {
      this.update(id, { estado: cliente.estado === 'activo' ? 'inactivo' : 'activo' });
    }
  }

  search(query: string): Cliente[] {
    const q = query.toLowerCase();
    return this._clientes().filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.apellido.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.documento.includes(q)
    );
  }
}
