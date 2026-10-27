
import { PartialType, OmitType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto.js';
import { EstadoUsuario } from '../../enums/estados-usuarios.enum.js';

export class UpdateUsuarioDto extends PartialType(
    OmitType(CreateUsuarioDto, ['clave'] as const),
) {
    @ApiPropertyOptional({
        enum: EstadoUsuario,
        example: EstadoUsuario.ACTIVO,
        description: 'Estado del usuario',
    })
    @IsOptional()
    @IsEnum(EstadoUsuario)
    estado?: EstadoUsuario;
}
