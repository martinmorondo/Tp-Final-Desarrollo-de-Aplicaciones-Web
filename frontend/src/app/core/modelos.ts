
export type Rol = 'MEDICO' | 'PACIENTE' | 'ADMINISTRADOR';

export interface LoginRequest {
  email: string;
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

export type EstadoReserva = 'ACTIVO' | 'ATENDIDO' | 'AUSENTE' | 'CANCELADO';
export type EstadoUsuario = 'ACTIVO' | 'BAJA';

export interface PacienteResumen {
  id: number;
  nombre: string;
}

export interface Reserva {
  id: number;
  fecha_hora: string;
  medico: string;
  estado: EstadoReserva;
  paciente: PacienteResumen;
  valor_consulta: number;
}

export interface CrearReservaRequest {
  id_medico: number;
  fecha_hora: string; // formato '2026-11-10T09:00:00'
  id_paciente?: number; // solo lo usa el administrador
}

export interface Medico {
  id: number;
  nombre: string;
  matricula: string;
  valor_consulta: number;
  estado: EstadoUsuario;
}
export interface Disponibilidad {
  fecha: string;
  horas_libres: number[];
}
