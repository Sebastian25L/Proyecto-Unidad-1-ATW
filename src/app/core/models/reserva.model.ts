export type ReservaEstado = 'pendiente' | 'confirmada' | 'en_curso' | 'completada' | 'cancelada';

export interface Reserva {
  id: number;
  codigo: string;
  clienteId: number;
  clienteNombre: string;
  habitacionId: number;
  habitacionNumero: string;
  habitacionTipo: string;
  fechaIngreso: string;
  fechaSalida: string;
  noches: number;
  precioTotal: number;
  estado: ReservaEstado;
  observaciones?: string;
  fechaCreacion: string;
}
