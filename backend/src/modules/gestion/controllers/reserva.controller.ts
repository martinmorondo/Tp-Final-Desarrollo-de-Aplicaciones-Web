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
import { CreateReservasDto } from "../dtos/input/create-reservas.dto.js";
import { UpdateReservasDto } from "../dtos/input/update-reservas.dto.js";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { ListReservasDTO } from "../dtos/output/list-reservas.dto.js";
import { ReservaDTO } from "../dtos/output/reservas.dto.js";
import { ReservasService } from "../services/reservas.service.js";
import { AuthGuard } from "../../auth/guardars/auth.guard.js";
import { RolesGuard } from '../../auth/guardars/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';

import type { Request } from 'express';

@Controller('Reservas')
export class ReservasController {

    constructor(private readonly service: ReservasService) { }


    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolUsuario.PACIENTE, RolUsuario.ADMINISTRADOR)
    @Post()
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



    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Put(':id')
    async actualizarReservas(
        @Body() dto: UpdateReservasDto,
        @Param('id', ParseIntPipe) id: number,
        @Req()
        request: Request & {
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



@ApiBearerAuth()
@ApiOkResponse({ type: ListReservasDTO, isArray: true })
@UseGuards(AuthGuard, RolesGuard)
@Get()
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


     @ApiBearerAuth()
    @ApiOkResponse({ type: ListReservasDTO, isArray: true })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolUsuario.MEDICO)
    @Get('medico')
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
    @UseGuards(AuthGuard, RolesGuard)
    @Get(':id')
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