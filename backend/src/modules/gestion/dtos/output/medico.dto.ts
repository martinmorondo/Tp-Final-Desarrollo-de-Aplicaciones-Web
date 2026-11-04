
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsNumber,
    IsString,
    Min,
    MinLength,
} from 'class-validator';

import { EstadoUsuario } from '../../enums/estados-usuarios.enum.js';

export class MedicoDTO {
    @ApiProperty({
        example: 1,
        description: 'Identificador único del médico.',
    })
    @IsInt()
    @Min(1)
    id!: number;

    @ApiProperty({
        example: 'Dr. Gregory House',
        description: 'Nombre completo del médico.',
    })
    @IsString()
    @MinLength(1)
    nombre!: string;

    @ApiProperty({
        example: 12345,
        description: 'Número de matrícula profesional del médico.',
    })
    @IsInt()
    @Min(1)
    matricula!: number;

    @ApiProperty({
        example: 15000,
        description: 'Valor actual de la consulta médica.',
        type: Number,
    })
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @Min(0)
    valor_consulta!: number;

    @ApiProperty({
        enum: EstadoUsuario,
        example: EstadoUsuario.ACTIVO,
        description: 'Estado del usuario asociado al médico.',
    })
    @IsEnum(EstadoUsuario)
    estado!: EstadoUsuario;
}
