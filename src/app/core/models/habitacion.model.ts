export type HabitacionTipo = 'Simple' | 'Doble' | 'Suite' | 'Suite Presidencial' | 'Familiar';
export type HabitacionEstado = 'disponible' | 'ocupada' | 'mantenimiento' | 'reservada';

export interface Habitacion {
  id: number;
  numero: string;
  tipo: HabitacionTipo;
  piso: number;
  capacidad: number;
  precioPorNoche: number;
  estado: HabitacionEstado;
  descripcion: string;
  amenidades: string[];
  imagen?: string;
}
