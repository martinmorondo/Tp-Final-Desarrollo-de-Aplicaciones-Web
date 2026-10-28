
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../../gestion/enums/rol-usuario.enum.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const rolesPermitidos = this.reflector.getAllAndOverride<RolUsuario[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // Si la ruta no especifica roles, no aplicamos restricciones por rol.
        if (!rolesPermitidos || rolesPermitidos.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const usuario = request.usuario;

        if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
            throw new ForbiddenException(
                'No tenés permisos para realizar esta operación',
            );
        }

        return true;
    }
}
