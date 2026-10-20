import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, Version } from "@nestjs/common";
import { CreateMedicoDto } from "../dtos/input/create-medico.dto.js";
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { ListMedicoDTO } from "../dtos/output/list-medico.dto.js";
import { UpdateMedicoDto } from "../dtos/input/update-medico.dato.js";
import { EstadoUsuario } from "../enums/estados-usuarios.enum.js";
import { AuthGuard } from "../../auth/guardars/auth.guard.js";
import { MedicoService } from "../services/medico.service.js";

@Controller('Medicos')
export class MedicoController {

    constructor(private readonly service: MedicoService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async crearMedico(@Body() dto: CreateMedicoDto): Promise<{ id: number }> {
        return await this.service.crearMedico(dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(":id")
    async actualizarMedico(@Param("id") id: number, @Body() dto: UpdateMedicoDto): Promise<void> {
        await this.service.actualizarMedico(id, dto);
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListMedicoDTO, isArray: true })
    @ApiQuery({
        name: 'estado',
        required: false,
        enum: EstadoUsuario
    })
    @UseGuards(AuthGuard)
    @Version("1")
    @Get()
    async obtenerMedico(@Query("estado") estado: EstadoUsuario): Promise<ListMedicoDTO[]> {
        return await this.service.obtenerMedico(estado);
    }

}