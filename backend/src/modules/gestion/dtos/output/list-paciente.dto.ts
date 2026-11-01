import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO que representa la información resumida de un paciente.
 *
 * Se utiliza para incluir los datos básicos del paciente
 * en las respuestas de las reservas.
 */
export class ListPacienteDTO {

    /**
     * Identificador único del paciente.
     */
    @ApiProperty({
        example: 15,
        description: 'Identificador único del paciente.',
    })
    id!: number;

    /**
     * Nombre completo del paciente.
     */
    @ApiProperty({
        example: 'Juan Pérez',
        description: 'Nombre completo del paciente.',
    })
    nombre!: string;

}