import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UsuariosService } from '../services/usuario.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private usuariosService: UsuariosService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);

            const usuario = await this.usuariosService.buscarUsuarioActivoPorId(
                Number(payload.sub),
            );

            if (!usuario) {
                throw new UnauthorizedException('Usuario inactivo o inexistente');
            }

            request['usuario'] = payload;
        } catch {
            throw new UnauthorizedException('Token inválido o usuario inactivo');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}