import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MedicoService } from '../services/medico.service.js';
import { CreateMedicoDto } from '../dtos/input/create-medico.dto.js';
import { UpdateMedicoDto } from '../dtos/input/update-medico.dato.js';
import { ListMedicoDTO } from '../dtos/output/list-medico.dto.js';
import { MedicoDTO } from '../dtos/output/medico.dto.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';
import { AuthGuard } from '../../auth/guardars/auth.guard.js';
import { RolesGuard } from '../../auth/guardars/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';

@ApiTags('Médicos')
@Controller('medicos')
export class MedicoController {
    constructor(private readonly medicoService: MedicoService) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMINISTRADOR)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar un nuevo perfil de médico' })
    @ApiResponse({ status: 201, description: 'Médico registrado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o usuario inexistente.' })
    async crearMedico(@Body() dto: CreateMedicoDto): Promise<{ id: number }> {
        return await this.medicoService.crearMedico(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener el listado de médicos (filtrable por estado)' })
    @ApiQuery({ name: 'estado', enum: EstadoUsuario, required: false })
    @ApiResponse({ status: 200, type: [ListMedicoDTO] })
    async obtenerMedicos(
    @Query('estado') estado?: EstadoUsuario,
): Promise<ListMedicoDTO[]> {
    return this.medicoService.obtenerMedicos(estado);
}

    @Get(':id')
    @ApiOperation({ summary: 'Obtener el detalle de un médico por su ID' })
    @ApiResponse({ status: 200, type: MedicoDTO })
    @ApiResponse({ status: 404, description: 'Médico no encontrado.' })
    async obtenerMedicoPorId(
    @Param('id', ParseIntPipe) id: number,
): Promise<MedicoDTO> {
    return this.medicoService.obtenerMedico(id);
}
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMINISTRADOR)
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Actualizar los datos de un médico' })
    @ApiResponse({ status: 204, description: 'Médico actualizado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Médico no encontrado.' })
    async actualizarMedico(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMedicoDto,
    ): Promise<void> {
        await this.medicoService.actualizarMedico(id, dto);
    }
}