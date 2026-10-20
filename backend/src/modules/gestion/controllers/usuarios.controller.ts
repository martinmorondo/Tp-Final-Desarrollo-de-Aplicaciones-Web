import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, Version } from "@nestjs/common";
import { CreateUsuarioDto } from "../dtos/input/create-usuario.dto.js";
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { ListUsuarioDTO } from "../dtos/output/list-usuario.dto.js";
import { UpdateUsuarioDto } from "../dtos/input/update-usuario.dto.js";
import { EstadoUsuario } from "../enums/estados-usuarios.enum.js";
import { AuthGuard } from "../../auth/guardars/auth.guard.js";
import { UsuarioService } from "../services/usuario.service.js";

@Controller('Usuarios')
export class UsuarioController {

    constructor(private readonly service: UsuarioService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async crearUsuario(@Body() dto: CreateUsuarioDto): Promise<{ id: number }> {
        return await this.service.crearUsuario(dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(":id")
    async actualizarusuario(@Param("id") id: number, @Body() dto: UpdateUsuarioDto): Promise<void> {
        await this.service.actualizarUsuario(id, dto);
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListUsuarioDTO, isArray: true })
    @ApiQuery({
        name: 'estado',
        required: false,
        enum: EstadoUsuario
    })
    @UseGuards(AuthGuard)
    @Version("1")
    @Get()
    async obtenerUsuario(@Query("estado") estado: EstadoUsuario): Promise<ListUsuarioDTO[]> {
        return await this.service.obtenerUsuario(estado);
    }

}