
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, Min, MinLength } from 'class-validator';

import { EstadoUsuario } from '../../enums/estados-usuarios.enum.js';

export class ListAdministradorDTO {
    @ApiProperty({
        example: 1,
        description: 'Identificador único del administrador.',
    })
    @IsInt()
    @Min(1)
    id!: number;

    @ApiProperty({
        example: 'Administrador Principal',
        description: 'Nombre completo del administrador.',
    })
    @IsString()
    @MinLength(1)
    nombre!: string;

    @ApiProperty({
        enum: EstadoUsuario,
        example: EstadoUsuario.ACTIVO,
        description: 'Estado del usuario administrador.',
    })
    @IsEnum(EstadoUsuario)
    estado!: EstadoUsuario;
}
