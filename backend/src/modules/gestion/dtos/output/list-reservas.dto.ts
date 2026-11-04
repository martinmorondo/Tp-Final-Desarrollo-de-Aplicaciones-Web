
import { ApiProperty } from '@nestjs/swagger';
import {
    IsDate,
    IsEnum,
    IsInt,
    IsNumber,
    IsString,
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
        example: '2026-11-15T10:00:00.000Z',
        description: 'Fecha y hora programada para el turno, en formato ISO 8601.',
        type: String,
        format: 'date-time',
    })
    @Type(() => Date)
    @IsDate()
    fecha_hora!: Date;

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
