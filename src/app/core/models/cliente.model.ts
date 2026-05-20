export type ClienteEstado = 'activo' | 'inactivo';

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
  tipoDocumento: 'DNI' | 'Pasaporte' | 'RUC';
  nacionalidad: string;
  estado: ClienteEstado;
  fechaRegistro: string;
  totalReservas: number;
}
