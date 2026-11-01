
import {
    Body,
    Controller,
    Get,
    ForbiddenException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';

import { CreateReservasDto } from '../dtos/input/create-reservas.dto.js';
import { UpdateReservasDto } from '../dtos/input/update-reservas.dto.js';
import { ListReservasDTO } from '../dtos/output/list-reservas.dto.js';
import { ReservaDTO } from '../dtos/output/reservas.dto.js';
import { ReservasService } from '../services/reservas.service.js';

import { AuthGuard } from '../../auth/guardars/auth.guard.js';
import { RolesGuard } from '../../auth/guardars/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';

import type { Request } from 'express';

/**
 * Controlador encargado de gestionar las reservas de turnos médicos.
 * Permite crear, consultar, listar y actualizar reservas según el rol del usuario.
 */
@ApiTags('Reservas')
@ApiBearerAuth()
@Controller('Reservas')
export class ReservasController {

    constructor(private readonly service: ReservasService) {}

    /**
     * Registra una nueva reserva.
     * Disponible para pacientes y administradores.
     * Los pacientes reservan para sí mismos y los administradores
     * pueden seleccionar al paciente correspondiente.
     *
     * @param dto Datos necesarios para crear la reserva.
     * @param request Información del usuario autenticado.
     * @returns Identificador de la reserva creada.
     */
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolUsuario.PACIENTE, RolUsuario.ADMINISTRADOR)
    @Post()
    @ApiOperation({
        summary: 'Crear una reserva',
        description: 'Permite a un paciente reservar un turno propio o a un administrador reservar para un paciente.',
    })
    @ApiBody({ type: CreateReservasDto })
    @ApiResponse({
        status: 201,
        description: 'Reserva creada correctamente.',
        schema: {
            example: { id: 1 },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Los datos son inválidos, el horario no está disponible o no se cumplen las reglas de reserva.',
    })
    @ApiResponse({
        status: 401,
        description: 'Usuario no autenticado o token inválido.',
    })
    @ApiResponse({
        status: 403,
        description: 'El usuario no tiene permisos para crear reservas.',
    })
    @ApiResponse({
        status: 404,
        description: 'Médico o paciente no encontrado.',
    })
    async crearReservas(
        @Body() dto: CreateReservasDto,
        @Req() request: Request & {
            usuario: { sub: number; rol: RolUsuario };
        },
    ): Promise<{ id: number }> {
        return this.service.crearReserva(
            dto,
            request.usuario.sub,
            request.usuario.rol,
        );
    }

    /**
     * Actualiza el estado de una reserva existente.
     * Las operaciones permitidas dependen del rol del usuario.
     *
     * @param dto Nuevo estado de la reserva.
     * @param id Identificador de la reserva.
     * @param request Información del usuario autenticado.
     */
    @UseGuards(AuthGuard, RolesGuard)
    @Put(':id')
    @ApiOperation({
        summary: 'Actualizar una reserva',
        description: 'Permite cancelar una reserva o actualizar su estado según los permisos del paciente, médico o administrador.',
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador de la reserva.',
        type: Number,
        example: 1,
    })
    @ApiBody({ type: UpdateReservasDto })
    @ApiResponse({
        status: 200,
        description: 'Reserva actualizada correctamente.',
    })
    @ApiResponse({
        status: 400,
        description: 'El estado solicitado no es válido o no se cumplen las condiciones para modificar la reserva.',
    })
    @ApiResponse({
        status: 401,
        description: 'Usuario no autenticado o token inválido.',
    })
    @ApiResponse({
        status: 403,
        description: 'El usuario no tiene permisos para modificar esta reserva.',
    })
    @ApiResponse({
        status: 404,
        description: 'Reserva no encontrada.',
    })
    async actualizarReservas(
        @Body() dto: UpdateReservasDto,
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request & {
            usuario: { sub: number; rol: RolUsuario };
        },
    ): Promise<void> {
        await this.service.actualizarReserva(
            id,
            dto,
            request.usuario.sub,
            request.usuario.rol,
        );
    }

    /**
     * Obtiene las reservas correspondientes al usuario autenticado.
     * Los pacientes consultan sus propias reservas y los administradores
     * pueden consultar todas las reservas.
     *
     * @param request Información del usuario autenticado.
     * @returns Listado de reservas según el rol.
     */
    @UseGuards(AuthGuard, RolesGuard)
    @Get()
    @ApiOperation({
        summary: 'Listar reservas',
        description: 'Los pacientes visualizan sus propias reservas y los administradores pueden consultar todas.',
    })
    @ApiResponse({
        status: 200,
        description: 'Listado de reservas obtenido correctamente.',
        type: ListReservasDTO,
        isArray: true,
    })
    @ApiResponse({
        status: 401,
        description: 'Usuario no autenticado o token inválido.',
    })
    @ApiResponse({
        status: 403,
        description: 'El usuario no tiene permisos para consultar este listado de reservas.',
    })
    async obtenerReservas(
        @Req() request: Request & {
            usuario: { sub: number; rol: RolUsuario };
        },
    ): Promise<ListReservasDTO[]> {
        const usuario = request.usuario;

        if (usuario.rol === RolUsuario.PACIENTE) {
            return this.service.obtenerReservasPorPaciente(usuario.sub);
        }

        if (usuario.rol === RolUsuario.ADMINISTRADOR) {
            return this.service.obtenerReservas();
        }

        throw new ForbiddenException(
            'No tenés permisos para consultar este listado de reservas',
        );
    }

    /**
     * Obtiene las reservas de un médico para una fecha determinada.
     *
     * @param fecha Fecha de consulta en formato YYYY-MM-DD.
     * @param request Información del médico autenticado.
     * @returns Reservas correspondientes al médico y la fecha indicados.
     */
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolUsuario.MEDICO)
    @Get('medico')
    @ApiOperation({
        summary: 'Consultar reservas del médico',
        description: 'Permite al médico autenticado consultar sus reservas para una fecha determinada.',
    })
    @ApiQuery({
        name: 'fecha',
        description: 'Fecha de consulta en formato YYYY-MM-DD.',
        required: true,
        type: String,
        example: '2026-11-02',
    })
    @ApiResponse({
        status: 200,
        description: 'Reservas del médico obtenidas correctamente.',
        type: ListReservasDTO,
        isArray: true,
    })
    @ApiResponse({
        status: 400,
        description: 'La fecha proporcionada no es válida.',
    })
    @ApiResponse({
        status: 401,
        description: 'Usuario no autenticado o token inválido.',
    })
    @ApiResponse({
        status: 403,
        description: 'El usuario no tiene permisos de médico.',
    })
    async obtenerReservasPorMedico(
        @Query('fecha') fecha: string,
        @Req() request: Request & {
            usuario: { sub: number; rol: RolUsuario };
        },
    ): Promise<ListReservasDTO[]> {
        return this.service.obtenerReservasPorMedicoYFecha(
            request.usuario.sub,
            fecha,
        );
    }
    @ApiBearerAuth()
@ApiOperation({ summary: 'Reservar un turno' })
@ApiResponse({ status: 201, description: 'Reserva creada.' })
@ApiResponse({ status: 400, description: 'Horario inválido u ocupado.' })
@ApiOperation({ summary: 'Cambiar el estado de una reserva (cancelar, atendido, ausente)' })
@ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
@ApiOperation({ summary: 'Listar reservas (las propias si sos paciente, todas si sos administrador)' })
@ApiOkResponse({ type: DisponibilidadDTO })
@UseGuards(AuthGuard, RolesGuard)
@Roles(RolUsuario.PACIENTE, RolUsuario.ADMINISTRADOR)
@Get('disponibilidad')
async obtenerDisponibilidad(
    @Query('id_medico', ParseIntPipe) idMedico: number,
    @Query('fecha') fecha: string,
): Promise<DisponibilidadDTO> {
    return this.service.obtenerDisponibilidad(idMedico, fecha);
}

    /**
     * Obtiene los datos de una reserva específica.
     * El acceso está sujeto a las reglas de autorización del servicio.
     *
     * @param id Identificador de la reserva.
     * @param request Información del usuario autenticado.
     * @returns Información de la reserva.
     */
    @UseGuards(AuthGuard, RolesGuard)
    @Get(':id')
    @ApiOperation({
        summary: 'Consultar reserva por ID',
        description: 'Devuelve el detalle de una reserva. El paciente puede consultar sus propias reservas y el administrador puede consultar cualquiera.',
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador de la reserva.',
        type: Number,
        example: 1,
    })
    @ApiResponse({
        status: 200,
        description: 'Reserva encontrada.',
        type: ReservaDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'El identificador proporcionado no es válido.',
    })
    @ApiResponse({
        status: 401,
        description: 'Usuario no autenticado o token inválido.',
    })
    @ApiResponse({
        status: 403,
        description: 'El usuario no tiene permisos para consultar esta reserva.',
    })
    @ApiResponse({
        status: 404,
        description: 'Reserva no encontrada.',
    })
    async obtenerReserva(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request & {
            usuario: { sub: number; rol: RolUsuario };
        },
    ): Promise<ReservaDTO> {
        return this.service.obtenerReserva(
            id,
            request.usuario.sub,
            request.usuario.rol,
        );
    }
}
