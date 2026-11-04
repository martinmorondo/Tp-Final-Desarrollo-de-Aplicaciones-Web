import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearReservaRequest, Disponibilidad, EstadoReserva, Reserva } from './modelos';

const URL = '/api/v1/reservas';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  constructor(private http: HttpClient) {}

  // Paciente: sus turnos. Administrador: todos los turnos.
  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(URL);
  }

  // Médico: sus turnos de una fecha (formato 'YYYY-MM-DD').
  listarPorMedicoYFecha(fecha: string): Observable<Reserva[]> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<Reserva[]>(`${URL}/medico`, { params });
  }

  // Paciente y administrador: horas libres de un médico en una fecha ('YYYY-MM-DD').
  disponibilidad(idMedico: number, fecha: string): Observable<Disponibilidad> {
    const params = new HttpParams().set('id_medico', idMedico).set('fecha', fecha);
    return this.http.get<Disponibilidad>(`${URL}/disponibilidad`, { params });
  }

  obtener(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${URL}/${id}`);
  }

  crear(datos: CrearReservaRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(URL, datos);
  }

  // Cancelar (paciente/admin) o marcar ATENDIDO/AUSENTE (médico).
  cambiarEstado(id: number, estado: EstadoReserva): Observable<void> {
    return this.http.put<void>(`${URL}/${id}`, { estado });
  }
}