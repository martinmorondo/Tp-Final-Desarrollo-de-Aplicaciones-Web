
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoReserva } from '../../enums/estados-reserva.enum.js';

export class UpdateReservasDto {
    @ApiProperty({
        enum: EstadoReserva,
        example: EstadoReserva.CANCELADO,
        description: 'Nuevo estado de la reserva',
    })
    @IsEnum(EstadoReserva)
    @IsNotEmpty()
    estado!: EstadoReserva;
}
