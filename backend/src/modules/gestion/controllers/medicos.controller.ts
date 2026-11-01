
import {
    Controller,
    Get,
    Put,
    Body,
    Param,
    Query,
    ParseIntPipe,
    ParseEnumPipe,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';

import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiParam,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';

import { MedicoService } from '../services/medico.service.js';
import { UpdateMedicoDto } from '../dtos/input/update-medico.dato.js';
import { ListMedicoDTO } from '../dtos/output/list-medico.dto.js';
import { MedicoDTO } from '../dtos/output/medico.dto.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';

import { AuthGuard } from '../../auth/guardars/auth.guard.js';
import { RolesGuard } from '../../auth/guardars/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';

/**
 * Controlador encargado de consultar médicos y administrar sus valores de consulta.
 */
@ApiTags('Médicos')
@Controller('medicos')
export class MedicoController {
    constructor(
        private readonly medicoService: MedicoService,
    ) {}

    /**
     * Obtiene el listado de médicos, permitiendo filtrar por estado.
     *
     * @param estado Estado del usuario médico (opcional).
     * @returns Listado de médicos.
     */
    @Get()
    @ApiOperation({
        summary: 'Obtener listado de médicos',
        description: 'Devuelve los médicos registrados y permite filtrar por estado ACTIVO o INACTIVO.',
    })
    @ApiQuery({
        name: 'estado',
        description: 'Estado del médico para filtrar el listado.',
        enum: EstadoUsuario,
        required: false,
        example: EstadoUsuario.ACTIVO,
    })
    @ApiResponse({
        status: 200,
        description: 'Listado de médicos obtenido correctamente.',
        type: [ListMedicoDTO],
    })
    @ApiResponse({
        status: 400,
        description: 'El estado proporcionado no es válido.',
    })
    async obtenerMedicos(
        @Query(
            'estado',
            new ParseEnumPipe(EstadoUsuario, { optional: true }),
        )
        estado?: EstadoUsuario,
    ): Promise<ListMedicoDTO[]> {
        return this.medicoService.obtenerMedicos(estado);
    }

    /**
     * Obtiene los datos de un médico específico.
     *
     * @param id Identificador del médico.
     * @returns Información del médico.
     */
    @Get(':id')
    @ApiOperation({
        summary: 'Obtener médico por ID',
        description: 'Devuelve los datos de un médico a partir de su identificador.',
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador del médico.',
        type: Number,
        example: 2,
    })
    @ApiResponse({
        status: 200,
        description: 'Médico encontrado.',
        type: MedicoDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'El identificador proporcionado no es válido.',
    })
    @ApiResponse({
        status: 404,
        description: 'Médico no encontrado.',
    })
    async obtenerMedicoPorId(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<MedicoDTO> {
        return this.medicoService.obtenerMedico(id);
    }

    /**
     * Actualiza el valor de consulta de un médico.
     * Esta operación está restringida al rol ADMINISTRADOR.
     *
     * @param id Identificador del médico.
     * @param dto Nuevo valor de consulta.
     */
    @Put(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMINISTRADOR)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Modificar valor de consulta',
        description: 'Actualiza el valor de consulta de un médico. Disponible exclusivamente para administradores.',
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador del médico.',
        type: Number,
        example: 2,
    })
    @ApiBody({
        type: UpdateMedicoDto,
    })
    @ApiResponse({
        status: 204,
        description: 'Valor de consulta actualizado correctamente.',
    })
    @ApiResponse({
        status: 400,
        description: 'Los datos enviados no son válidos.',
    })
    @ApiResponse({
        status: 401,
        description: 'No se proporcionó un token válido.',
    })
    @ApiResponse({
        status: 403,
        description: 'El usuario no tiene permisos de administrador.',
    })
    @ApiResponse({
        status: 404,
        description: 'Médico no encontrado.',
    })
    async actualizarMedico(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMedicoDto,
    ): Promise<void> {
        await this.medicoService.actualizarMedico(id, dto);
    }
}
