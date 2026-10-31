
export type Rol = 'MEDICO' | 'PACIENTE' | 'ADMINISTRADOR';

export interface LoginRequest {
  nombre: string;
  clave: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface Sesion {
  id: number;
  nombre: string;
  rol: Rol;
}