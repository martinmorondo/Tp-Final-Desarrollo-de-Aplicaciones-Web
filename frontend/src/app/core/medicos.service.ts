import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoUsuario, Medico } from './modelos';

const URL = '/api/v1/medicos';

@Injectable({ providedIn: 'root' })
export class MedicosService {
  constructor(private http: HttpClient) {}

  listar(estado?: EstadoUsuario): Observable<Medico[]> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    return this.http.get<Medico[]>(URL, { params });
  }

  // Solo administrador.
  actualizarValorConsulta(id: number, valor_consulta: number): Observable<void> {
    return this.http.put<void>(`${URL}/${id}`, { valor_consulta });
  }
}