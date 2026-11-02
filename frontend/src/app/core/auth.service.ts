import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, Rol, Sesion } from './modelos';

const CLAVE_TOKEN = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(datos: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/v1/auth', datos)
      .pipe(tap((r) => localStorage.setItem(CLAVE_TOKEN, r.accessToken)));
  }

  logout(): void {
    localStorage.removeItem(CLAVE_TOKEN);
  }

  getToken(): string | null {
    return localStorage.getItem(CLAVE_TOKEN);
  }

  estaLogueado(): boolean {
    return this.sesion() !== null;
  }

  sesion(): Sesion | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(''),
      );
      const payload = JSON.parse(json);
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        this.logout();
        return null;
      }
      return { id: Number(payload.sub), nombre: payload.nombre, rol: payload.rol as Rol };
    } catch {
      return null;
    }
  }

  rol(): Rol | null {
    return this.sesion()?.rol ?? null;
  }
}