import { ApiProperty } from '@nestjs/swagger';
import { EstadoReserva } from '../../enums/estados-reserva.enum.js';
import { ListPacienteDTO } from './list-paciente.dto.js';

export class ListReservasDTO {
    @ApiProperty({ example: 1 })
    id!: number;

    @ApiProperty({
        example: '2026-11-15T10:00:00.000Z',
        description: 'Fecha y hora del turno',
    })
    fecha_hora!: Date;

    @ApiProperty({
        example: 'Dr. Gregory House',
        description: 'Nombre del médico',
    })
    medico!: string;

    @ApiProperty({ enum: EstadoReserva })
    estado!: EstadoReserva;

    @ApiProperty({ type: () => ListPacienteDTO })
    paciente!: ListPacienteDTO;

    @ApiProperty({ example: 15000 })
    valor_consulta!: number;
}