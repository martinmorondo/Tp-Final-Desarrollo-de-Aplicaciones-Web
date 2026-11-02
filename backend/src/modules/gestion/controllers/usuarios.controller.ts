import { Controller, Get, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { UsuarioService } from '../services/usuario.service.js';
import { ListPacienteDTO } from '../dtos/output/list-paciente.dto.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';

import { AuthGuard } from '../../auth/guardars/auth.guard.js';
import { RolesGuard } from '../../auth/guardars/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';

/**
 * Controlador de consulta de usuarios.
 * La gestión (alta, baja y modificación) de usuarios queda fuera de esta etapa.
 */
@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuarioService: UsuarioService) {}

    /**
     * Obtiene el listado de pacientes activos.
     * Operación restringida al rol ADMINISTRADOR.
     *
     * @returns Pacientes con su identificador y nombre completo.
     */
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMINISTRADOR)
    @Get('pacientes')
    @ApiOperation({
        summary: 'Listar pacientes activos',
        description: 'Devuelve los pacientes activos para que el administrador pueda reservar un turno a su nombre.',
    })
    @ApiOkResponse({
        description: 'Listado de pacientes obtenido correctamente.',
        type: ListPacienteDTO,
        isArray: true,
    })
    @ApiResponse({
        status: 401,
        description: 'Usuario no autenticado o token inválido.',
    })
    @ApiResponse({
        status: 403,
        description: 'El usuario no tiene permisos de administrador.',
    })
    async obtenerPacientes(): Promise<ListPacienteDTO[]> {
        return this.usuarioService.obtenerPacientes();
    }
}
