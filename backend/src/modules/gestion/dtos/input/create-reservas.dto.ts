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

export class CreateReservasDto {
    @ApiProperty({
        description: 'ID del médico al que se solicita el turno',
        example: 1,
    })
    @IsDefined({ message: 'El ID del médico es obligatorio' })
    @Type(() => Number)
    @IsInt({ message: 'El ID del médico debe ser un número entero' })
    @IsPositive({ message: 'El ID del médico debe ser positivo' })
    id_medico!: number;

    @ApiProperty({
        description: 'Fecha y hora del turno en formato ISO 8601',
        example: '2026-11-10T09:00:00',
    })
    @IsDefined({ message: 'La fecha y hora del turno son obligatorias' })
    @Type(() => Date)
    @IsDate({ message: 'La fecha y hora del turno no son válidas' })
    fecha_hora!: Date;

    @ApiPropertyOptional({
        description: 'ID del paciente para quien se reserva el turno. Requerido para administradores.',
        example: 2,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'El ID del paciente debe ser un número entero' })
    @IsPositive({ message: 'El ID del paciente debe ser positivo' })
    id_paciente?: number;
}