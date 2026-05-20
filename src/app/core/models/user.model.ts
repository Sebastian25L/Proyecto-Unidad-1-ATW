export type UserRole = 'admin' | 'recepcionista' | 'supervisor';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: UserRole;
  avatar?: string;
  activo: boolean;
}
