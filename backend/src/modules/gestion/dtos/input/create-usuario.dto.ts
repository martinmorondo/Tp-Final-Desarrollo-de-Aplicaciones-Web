
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';
import { RolUsuario } from '../../enums/rol-usuario.enum.js';

export class CreateUsuarioDto {
    @ApiProperty({ example: '12345678', description: 'Documento único del usuario' })
    @IsString()
    @IsNotEmpty()
    documento!: string;

    @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
    @IsString()
    @IsNotEmpty()
    apellidos!: string;

    @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
    @IsString()
    @IsNotEmpty()
    nombres!: string;

    @ApiProperty({ example: 'juan@example.com', description: 'Correo electrónico' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({
        example: 'ClaveSegura123',
        description: 'Contraseña del usuario',
        minLength: 8,
        writeOnly: true,
    })
    @IsString()
    @MinLength(8)
    clave!: string;

    @ApiProperty({ enum: RolUsuario, example: RolUsuario.PACIENTE })
    @IsEnum(RolUsuario)
    rol!: RolUsuario;
}
