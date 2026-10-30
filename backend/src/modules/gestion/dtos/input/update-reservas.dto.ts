import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum } from 'class-validator';
import { EstadoReserva } from '../../enums/estados-reserva.enum.js';

export class UpdateReservasDto {
    @ApiProperty({
        enum: EstadoReserva,
        example: EstadoReserva.CANCELADO,
        description: 'Nuevo estado de la reserva',
    })
    @IsDefined({ message: 'El estado de la reserva es obligatorio' })
    @IsEnum(EstadoReserva, {
        message: 'El estado indicado no es válido',
    })
    estado!: EstadoReserva;
}