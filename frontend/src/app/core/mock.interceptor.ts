import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of, throwError } from 'rxjs';
import { USAR_MOCK } from './config';

const USUARIOS = [
  { email: 'paciente@test.com', clave: '1234', id: 3, nombre: 'Paula', rol: 'PACIENTE' },
  { email: 'medico@test.com', clave: '1234', id: 2, nombre: 'Mario', rol: 'MEDICO' },
  { email: 'admin@test.com', clave: '1234', id: 1, nombre: 'Ana', rol: 'ADMINISTRADOR' },
];

function base64url(texto: string): string {
  return btoa(texto).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function crearTokenFalso(id: number, nombre: string, rol: string): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({
      sub: id,
      nombre,
      rol,
      exp: Math.floor(Date.now() / 1000) + 8 * 3600,
    }),
  );
  return `${header}.${payload}.firma-falsa`;
}

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!USAR_MOCK) return next(req);

  if (req.method === 'POST' && req.url.endsWith('/api/v1/auth')) {
    const { nombre, clave } = req.body as { nombre: string; clave: string };
    const usuario = USUARIOS.find((u) => u.email === nombre && u.clave === clave);

    if (!usuario) {
      return throwError(
        () => new HttpErrorResponse({ status: 401, url: req.url }),
      ).pipe(delay(300));
    }

    const accessToken = crearTokenFalso(usuario.id, usuario.nombre, usuario.rol);
    return of(new HttpResponse({ status: 200, body: { accessToken } })).pipe(delay(300));
  }

  return next(req);
};