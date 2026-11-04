import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Rol } from './modelos';

export const RUTA_POR_ROL: Record<Rol, string> = {
  PACIENTE: '/paciente',
  MEDICO: '/medico',
  ADMINISTRADOR: '/admin',
};

export const rolGuard = (rolesPermitidos: Rol[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const rol = auth.rol();

    if (!rol) {
      return router.parseUrl('/login');
    }
    if (!rolesPermitidos.includes(rol)) {
      return router.parseUrl(RUTA_POR_ROL[rol]);
    }
    return true;
  };
};