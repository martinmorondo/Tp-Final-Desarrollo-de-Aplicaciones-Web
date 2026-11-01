import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, of, throwError } from 'rxjs';
import { USAR_MOCK } from './config';
import { AuthService } from './auth.service';
import { CrearReservaRequest, EstadoReserva, Medico, Reserva } from './modelos';

const USUARIOS = [
  { email: 'paciente@test.com', clave: '1234', id: 3, nombre: 'Paula', rol: 'PACIENTE' },
  { email: 'medico@test.com', clave: '1234', id: 2, nombre: 'Gregory House', rol: 'MEDICO' },
  { email: 'admin@test.com', clave: '1234', id: 1, nombre: 'Ana', rol: 'ADMINISTRADOR' },
];

function enDias(n: number, hora: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  const hh = String(hora).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}T${hh}:00:00`;
}

const medicos: Medico[] = [
  { id: 1, nombre: 'Gregory House', matricula: 'MN-12345', valor_consulta: 15000, estado: 'ACTIVO' },
  { id: 2, nombre: 'Meredith Grey', matricula: 'MN-67890', valor_consulta: 18000, estado: 'ACTIVO' },
];

// id de usuario -> id de médico
const MEDICO_POR_USUARIO: Record<number, number> = { 2: 1 };

type ReservaMock = Reserva & { id_medico: number };

let proximoId = 6;
const reservas: ReservaMock[] = [
  { id: 1, id_medico: 1, medico: 'Gregory House', fecha_hora: enDias(3, 10), estado: 'ACTIVO',
    paciente: { id: 3, nombre: 'Paula' }, valor_consulta: 15000 },
  { id: 2, id_medico: 1, medico: 'Gregory House', fecha_hora: enDias(3, 11), estado: 'ACTIVO',
    paciente: { id: 4, nombre: 'Pedro' }, valor_consulta: 15000 },
  { id: 3, id_medico: 2, medico: 'Meredith Grey', fecha_hora: enDias(-5, 9), estado: 'ATENDIDO',
    paciente: { id: 3, nombre: 'Paula' }, valor_consulta: 18000 },

      { id: 4, id_medico: 1, medico: 'Gregory House', fecha_hora: enDias(-1, 9), estado: 'ACTIVO',
    paciente: { id: 4, nombre: 'Pedro' }, valor_consulta: 15000 },
  { id: 5, id_medico: 1, medico: 'Gregory House', fecha_hora: enDias(-1, 10), estado: 'ACTIVO',
    paciente: { id: 5, nombre: 'Lucía' }, valor_consulta: 15000 },
];

function base64url(texto: string): string {
  return btoa(texto).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function crearTokenFalso(id: number, nombre: string, rol: string): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({ sub: id, nombre, rol, exp: Math.floor(Date.now() / 1000) + 8 * 3600 }),
  );
  return `${header}.${payload}.firma-falsa`;
}

function inicioDelDia(d: Date): number {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c.getTime();
}

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!USAR_MOCK) return next(req);

  const auth = inject(AuthService);

  const ok = (body: unknown, status = 200) =>
    of(new HttpResponse({ status, body })).pipe(delay(300));

  const fallo = (status: number, message: string) =>
    throwError(
      () => new HttpErrorResponse({ status, url: req.url, error: { message, statusCode: status } }),
    ).pipe(delay(300));

  // ---- Login ----
  if (req.method === 'POST' && req.url.endsWith('/api/v1/auth')) {
    const { nombre, clave } = req.body as { nombre: string; clave: string };
    const usuario = USUARIOS.find((u) => u.email === nombre && u.clave === clave);
    if (!usuario) return fallo(401, 'Unauthorized');
    return ok({ accessToken: crearTokenFalso(usuario.id, usuario.nombre, usuario.rol) });
  }

  // ---- Médicos ----
  if (req.method === 'GET' && req.url === '/api/v1/medicos') {
    const estado = req.params.get('estado');
    return ok(estado ? medicos.filter((m) => m.estado === estado) : medicos);
  }

  // ---- Reservas ----
  if (req.url.startsWith('/api/v1/reservas')) {
    const sesion = auth.sesion();
    if (!sesion) return fallo(401, 'Unauthorized');

        // Turnos del médico para una fecha
    if (req.method === 'GET' && req.url === '/api/v1/reservas/medico') {
      if (sesion.rol !== 'MEDICO') return fallo(403, 'No tenés permisos para esta operación');
      const fecha = req.params.get('fecha') ?? '';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fallo(400, 'La fecha debe tener el formato YYYY-MM-DD');
      }
      const idMedico = MEDICO_POR_USUARIO[sesion.id];
      const delDia = reservas
        .filter((r) => r.id_medico === idMedico && r.fecha_hora.startsWith(fecha))
        .sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora));
      return ok(delDia);
    }

    // Listar mis turnos (paciente)
    if (req.method === 'GET' && req.url === '/api/v1/reservas') {
      if (sesion.rol === 'PACIENTE') {
        const mias = reservas
          .filter((r) => r.paciente.id === sesion.id)
          .sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora));
        return ok(mias);
      }
      return fallo(403, 'Este rol todavía no está simulado en el mock');
    }

    // Crear reserva (paciente)
    if (req.method === 'POST' && req.url === '/api/v1/reservas') {
      if (sesion.rol !== 'PACIENTE') {
        return fallo(403, 'Este rol todavía no está simulado en el mock');
      }
      const dto = req.body as CrearReservaRequest;
      const medico = medicos.find((m) => m.id === dto.id_medico);
      if (!medico) return fallo(404, 'Médico no encontrado');

      const fecha = new Date(dto.fecha_hora);
      if (Number.isNaN(fecha.getTime())) return fallo(400, 'La fecha y hora del turno no son válidas');

      const ahora = new Date();
      const limite = new Date();
      limite.setDate(limite.getDate() + 30);

      if (fecha <= ahora) return fallo(400, 'El turno debe ser en una fecha y hora futuras');
      if (fecha > limite) {
        return fallo(400, 'No se pueden reservar turnos con más de 30 días de anticipación');
      }
      if (fecha.getHours() < 8 || fecha.getHours() >= 16 || fecha.getMinutes() !== 0) {
        return fallo(400, 'Los turnos deben comenzar en horas enteras entre las 08:00 y las 15:00');
      }
      const ocupado = reservas.some(
        (r) =>
          r.id_medico === medico.id &&
          r.estado === 'ACTIVO' &&
          new Date(r.fecha_hora).getTime() === fecha.getTime(),
      );
      if (ocupado) return fallo(400, 'El médico ya tiene una reserva en ese horario');

      const nueva: ReservaMock = {
        id: proximoId++,
        id_medico: medico.id,
        medico: medico.nombre,
        fecha_hora: dto.fecha_hora,
        estado: 'ACTIVO',
        paciente: { id: sesion.id, nombre: sesion.nombre },
        valor_consulta: medico.valor_consulta, // se congela al reservar
      };
      reservas.push(nueva);
      return ok({ id: nueva.id }, 201);
    }

    // Cambiar estado (cancelar / atendido / ausente)
    const coincide = req.url.match(/^\/api\/v1\/reservas\/(\d+)$/);
    if (req.method === 'PUT' && coincide) {
      const reserva = reservas.find((r) => r.id === Number(coincide[1]));
      if (!reserva) return fallo(404, 'Reserva no encontrada');
      if (reserva.estado !== 'ACTIVO') return fallo(400, 'Solo se pueden modificar reservas activas');

      const { estado } = req.body as { estado: EstadoReserva };

      if (sesion.rol === 'MEDICO') {
        if (reserva.id_medico !== MEDICO_POR_USUARIO[sesion.id]) {
          return fallo(403, 'No tenés permisos para modificar este turno');
        }
        if (estado !== 'ATENDIDO' && estado !== 'AUSENTE') {
          return fallo(403, 'Los médicos solo pueden marcar turnos como atendidos o ausentes');
        }
        if (new Date(reserva.fecha_hora) > new Date()) {
          return fallo(400, 'No podés registrar el resultado de un turno que todavía no comenzó');
        }
        reserva.estado = estado;
        return ok(null, 204);
      }

      if (sesion.rol !== 'PACIENTE') {
        return fallo(403, 'Este rol todavía no está simulado en el mock');
      }
      if (reserva.paciente.id !== sesion.id) {
        return fallo(403, 'No tenés permisos para modificar esta reserva');
      }
      if (estado !== 'CANCELADO') {
        return fallo(403, 'Los pacientes solo pueden cancelar sus reservas');
      }
      if (inicioDelDia(new Date(reserva.fecha_hora)) <= inicioDelDia(new Date())) {
        return fallo(400, 'Solo podés cancelar hasta el día anterior al turno');
      }
      reserva.estado = estado;
      return ok(null, 204);
    }
  }

  return next(req);
};