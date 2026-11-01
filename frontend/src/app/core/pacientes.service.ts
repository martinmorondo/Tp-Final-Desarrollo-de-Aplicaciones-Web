import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteResumen } from './modelos';

@Injectable({ providedIn: 'root' })
export class PacientesService {
  constructor(private http: HttpClient) {}

  // Solo administrador. Endpoint pendiente de crear en el backend.
  listar(): Observable<PacienteResumen[]> {
    return this.http.get<PacienteResumen[]>('/api/v1/usuarios/pacientes');
  }
}