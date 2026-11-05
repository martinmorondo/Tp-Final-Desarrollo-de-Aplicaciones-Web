
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsNumber,
    IsString,
    Matches,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { EstadoReserva } from '../../enums/estados-reserva.enum.js';
import { ListPacienteDTO } from './list-paciente.dto.js';

export class ListReservasDTO {
    @ApiProperty({
        example: 1,
        description: 'Identificador único de la reserva.',
    })
    @IsInt()
    @Min(1)
    id!: number;

        @ApiProperty({
        example: '2026-11-15T10:00:00',
        description: 'Fecha y hora local del consultorio, sin zona horaria.',
        type: String,
    })
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
    fecha_hora!: string;

    @ApiProperty({
        example: 'Dr. Gregory House',
        description: 'Nombre del médico asignado al turno.',
    })
    @IsString()
    @MinLength(1)
    medico!: string;

    @ApiProperty({
        enum: EstadoReserva,
        example: EstadoReserva.ACTIVO,
        description: 'Estado actual de la reserva.',
    })
    @IsEnum(EstadoReserva)
    estado!: EstadoReserva;

    @ApiProperty({
        type: () => ListPacienteDTO,
        description: 'Datos del paciente para quien se realizó la reserva.',
    })
    @ValidateNested()
    @Type(() => ListPacienteDTO)
    paciente!: ListPacienteDTO;

    @ApiProperty({
        example: 15000,
        description: 'Valor de la consulta médica congelado al momento de reservar.',
        type: Number,
    })
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @Min(0)
    valor_consulta!: number;
}
