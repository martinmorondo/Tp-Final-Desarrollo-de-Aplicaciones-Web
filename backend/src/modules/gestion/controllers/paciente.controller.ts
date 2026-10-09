import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, Version } from "@nestjs/common";
import { CreatePacienteDto } from "../dtos/input/create-paciente.dto.js";
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { ListPacienteDTO } from "../dtos/output/list-paciente.dto.js";
import { UpdatePacienteDto } from "../dtos/input/update-paciente.dto.js";
import { EstadoUsuario } from "../enums/estados-usuarios.enum.js";
import { AuthGuard } from "../../auth/guardars/auth.guard.js";
import { PacienteService } from "../services/paciente.service.js";

@Controller('Pacientes')
export class PacienteController {

    constructor(private readonly service: PacienteService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async crearPaciente(@Body() dto: CreatePacienteDto): Promise<{ id: number }> {
        return await this.service.crearPaciente(dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(":id")
    async actualizarPaciente(@Param("id") id: number, @Body() dto: UpdatePacienteDto): Promise<void> {
        await this.service.actualizarPaciente(id, dto);
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListPacienteDTO, isArray: true })
    @ApiQuery({
        name: 'estado',
        required: false,
        enum: EstadoUsuario
    })
    @UseGuards(AuthGuard)
    @Version("1")
    @Get()
    async obtenerPaciente(@Query("estado") estado: EstadoUsuario): Promise<ListPacienteDTO[]> {
        return await this.service.obtenerPaciente(estado);
    }

}