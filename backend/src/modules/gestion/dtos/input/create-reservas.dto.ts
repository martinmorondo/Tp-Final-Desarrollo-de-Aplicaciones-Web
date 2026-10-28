
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsInt,
    IsNotEmpty,
    IsPositive,
} from 'class-validator';

export class CreateReservasDto {
    @ApiProperty({
        description: 'ID del médico al que se solicita el turno',
        example: 1,
    })
    @Type(() => Number)
    @IsInt({ message: 'El ID del médico debe ser un número entero' })
    @IsPositive({ message: 'El ID del médico debe ser positivo' })
    id_medico!: number;

    @ApiProperty({
        description: 'Fecha y hora del turno en formato ISO 8601',
        example: '2026-11-10T09:00:00',
    })
    @Type(() => Date)
    @IsDate({ message: 'La fecha y hora del turno no son válidas' })
    @IsNotEmpty({ message: 'La fecha y hora del turno son obligatorias' })
    fecha_hora!: Date;
}
