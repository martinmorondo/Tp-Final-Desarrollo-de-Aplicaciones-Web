import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum } from 'class-validator';

import { EstadoReserva } from '../../enums/estados-reserva.enum.js';

export class UpdateReservasDto {
    @ApiProperty({
        enum: [EstadoReserva.ATENDIDO, EstadoReserva.AUSENTE, EstadoReserva.CANCELADO],
        example: EstadoReserva.CANCELADO,
        description: 'Nuevo estado de la reserva.',
    })
    @IsDefined({ message: 'El estado de la reserva es obligatorio' })
    @IsEnum(
        {
            ATENDIDO: EstadoReserva.ATENDIDO,
            AUSENTE: EstadoReserva.AUSENTE,
            CANCELADO: EstadoReserva.CANCELADO,
        },
        { message: 'El estado indicado no es válido' },
    )
    estado!: EstadoReserva;
}