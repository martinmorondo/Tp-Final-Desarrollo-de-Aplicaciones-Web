import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, Version } from "@nestjs/common";
import { CreateAdministradorDto } from "../dtos/input/create-administrador.dto.js";
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { ListAdministradorDTO } from "../dtos/output/list-administrador.dto.js";
import { UpdateAdministradorDto } from "../dtos/input/update-administrador.dto.js";
import { EstadoUsuario } from "../enums/estados-usuarios.enum.js";
import { AuthGuard } from "../../auth/guardars/auth.guard.js";
import { AdministradorService } from "../services/administrador.service.js";

@Controller('Administradores')
export class AdministradorController {

    constructor(private readonly service: AdministradorService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async crearAdministrador(@Body() dto: CreateAdministradorDto): Promise<{ id: number }> {
        return await this.service.crearAdministrador(dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(":id")
    async actualizarAdministrador(@Param("id") id: number, @Body() dto: UpdateAdministradorDto): Promise<void> {
        await this.service.actualizarAdministrador(id, dto);
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListAdministradorDTO, isArray: true })
    @ApiQuery({
        name: 'estado',
        required: false,
        enum: EstadoUsuario
    })
    @UseGuards(AuthGuard)
    @Version("1")
    @Get()
    async obtenerAdminstrador(@Query("estado") estado: EstadoUsuario): Promise<ListAdministradorDTO[]> {
        return await this.service.obtenerAdministrador(estado);
    }

}