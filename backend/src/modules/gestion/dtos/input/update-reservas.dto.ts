import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum } from 'class-validator';

import { EstadoReserva } from '../../enums/estados-reserva.enum.js';

/**
 * DTO utilizado para recibir el nuevo estado de una reserva.
 *
 * Permite solicitar la actualización del estado de un turno,
 * de acuerdo con los permisos y las reglas de negocio del sistema.
 */
export class UpdateReservasDto {

    /**
     * Nuevo estado que se desea asignar a la reserva.
     *
     * Los valores permitidos están definidos en el enum EstadoReserva.
     */
    @ApiProperty({
        enum: EstadoReserva,
        example: EstadoReserva.CANCELADO,
        description: 'Nuevo estado que se desea asignar a la reserva.',
    })
    @IsDefined({ message: 'El estado de la reserva es obligatorio' })
    @IsEnum(EstadoReserva, {
        message: 'El estado indicado no es válido',
    })
    estado!: EstadoReserva;

}