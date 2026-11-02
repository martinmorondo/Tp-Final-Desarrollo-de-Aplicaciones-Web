
import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
    IsDate,
    IsDefined,
    IsInt,
    IsOptional,
    IsPositive,
} from 'class-validator';

/**
 * DTO utilizado para recibir los datos necesarios
 * para registrar una nueva reserva de turno médico.
 */
export class CreateReservasDto {

    @ApiProperty({
        description: 'Identificador del médico al que se solicita el turno.',
        example: 1,
        type: Number,
    })
    @IsDefined({ message: 'El ID del médico es obligatorio' })
    @Type(() => Number)
    @IsInt({ message: 'El ID del médico debe ser un número entero' })
    @IsPositive({ message: 'El ID del médico debe ser positivo' })
    id_medico!: number;

    @ApiProperty({
        description: 'Fecha y hora del turno en formato ISO 8601.',
        example: '2026-11-10T09:00:00',
        type: String,
        format: 'date-time',
    })
    @IsDefined({ message: 'La fecha y hora del turno son obligatorias' })
    @Type(() => Date)
    @IsDate({ message: 'La fecha y hora del turno no son válidas' })
    fecha_hora!: Date;

    @ApiPropertyOptional({
        description: 'Identificador del paciente para quien se reserva el turno. Es obligatorio cuando la reserva la realiza un administrador. Los pacientes reservan para sí mismos.',
        example: 2,
        type: Number,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'El ID del paciente debe ser un número entero' })
    @IsPositive({ message: 'El ID del paciente debe ser positivo' })
    id_paciente?: number;
}
