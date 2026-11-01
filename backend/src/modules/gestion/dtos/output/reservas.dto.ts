import { ApiProperty } from '@nestjs/swagger';

import { EstadoReserva } from '../../enums/estados-reserva.enum.js';
import { ListPacienteDTO } from './list-paciente.dto.js';

/**
 * DTO que representa el detalle de una reserva individual.
 *
 * Contiene la información del turno, el médico asignado,
 * el paciente asociado, el estado y el valor de la consulta.
 */
export class ReservaDTO {

    /**
     * Identificador único de la reserva.
     */
    @ApiProperty({
        example: 1,
        description: 'Identificador único de la reserva.',
    })
    id!: number;

    /**
     * Fecha y hora programada para el turno.
     */
    @ApiProperty({
        example: '2026-11-15T10:00:00.000Z',
        description: 'Fecha y hora programada para el turno, en formato ISO 8601.',
        type: String,
        format: 'date-time',
    })
    fecha_hora!: Date;

    /**
     * Nombre completo del médico asignado.
     */
    @ApiProperty({
        example: 'Dr. Gregory House',
        description: 'Nombre del médico asignado a la reserva.',
    })
    medico!: string;

    /**
     * Estado actual de la reserva.
     */
    @ApiProperty({
        enum: EstadoReserva,
        example: EstadoReserva.ACTIVO,
        description: 'Estado actual de la reserva.',
    })
    estado!: EstadoReserva;

    /**
     * Información del paciente asociado a la reserva.
     */
    @ApiProperty({
        type: () => ListPacienteDTO,
        description: 'Datos del paciente para quien se realizó la reserva.',
    })
    paciente!: ListPacienteDTO;

    /**
     * Valor de la consulta registrado al momento de realizar la reserva.
     */
    @ApiProperty({
        example: 15000,
        description: 'Valor de la consulta médica congelado al momento de reservar.',
        type: Number,
    })
    valor_consulta!: number;

}