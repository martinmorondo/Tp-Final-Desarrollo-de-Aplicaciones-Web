import { Body, Controller, Get, NotImplementedException, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CreateReservasDto } from "../dtos/input/create-reservas.dto.js";
import { UpdateReservasDto } from "../dtos/input/update-reservas.dto.js";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { ListReservasDTO } from "../dtos/output/list-reservas.dto.js";
import { ReservaDTO } from "../dtos/output/reservas.dto.js";
import { ReservasService } from "../services/reservas.service.js";
import { AuthGuard } from "../../auth/guardars/auth.guard.js";

@Controller('Reservas')
export class ReservasController {

    constructor(private readonly service: ReservasService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async crearReservas(@Body() dto: CreateReservasDto): Promise<{ id: number }> {

        return await this.service.crearReserva(dto);

    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(':id')
async actualizarReservas(
    @Body() dto: UpdateReservasDto,
    @Param('id', ParseIntPipe) id: number,
): Promise<void> {
    await this.service.actualizarReserva(id, dto);
}

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListReservasDTO, isArray: true })
    @UseGuards(AuthGuard)
    @Get()
    async obtenerReservas(): Promise<ListReservasDTO[]> {

        return await this.service.obtenerReservas();
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get(':id')
    async obtenerReserva(@Param('id', ParseIntPipe) id: number): Promise<ReservaDTO> {
    return await this.service.obtenerReserva(id); // <--- Corregido a singular 'obtenerReserva'
    }
}