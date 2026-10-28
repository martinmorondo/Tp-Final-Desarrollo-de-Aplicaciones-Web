import {
    Body,
    Controller,
    Get,
    Param,
    ParseEnumPipe,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
    Version,
} from '@nestjs/common';;
import { CreateUsuarioDto } from "../dtos/input/create-usuario.dto.js";
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { ListUsuarioDTO } from "../dtos/output/list-usuario.dto.js";
import { UpdateUsuarioDto } from "../dtos/input/update-usuario.dto.js";
import { EstadoUsuario } from "../enums/estados-usuarios.enum.js";
import { AuthGuard } from "../../auth/guardars/auth.guard.js";
import { UsuarioService } from "../services/usuario.service.js";
import { RolesGuard } from '../../auth/guardars/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';

@Controller('Usuarios')
export class UsuarioController {

    constructor(private readonly service: UsuarioService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMINISTRADOR)
    @Post()
    async crearUsuario(
        @Body() dto: CreateUsuarioDto,
    ): Promise<{ id: number }> {
        return this.service.crearUsuario(dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMINISTRADOR)
    @Put(':id')
async actualizarusuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
): Promise<void> {
    await this.service.actualizarUsuario(id, dto);
}

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListUsuarioDTO, isArray: true })
    @ApiQuery({
        name: 'estado',
        required: false,
        enum: EstadoUsuario
    })
    @UseGuards(AuthGuard, RolesGuard)
@Roles(RolUsuario.ADMINISTRADOR)
@Version('1')
@Get()
@ApiBearerAuth()
@ApiOkResponse({ type: ListUsuarioDTO, isArray: true })
@ApiQuery({
    name: 'estado',
    required: false,
    enum: EstadoUsuario,
})
async obtenerUsuario(
    @Query('estado', new ParseEnumPipe(EstadoUsuario, { optional: true }))
    estado?: EstadoUsuario,
): Promise<ListUsuarioDTO[]> {
    return this.service.obtenerUsuario(estado);
}
}