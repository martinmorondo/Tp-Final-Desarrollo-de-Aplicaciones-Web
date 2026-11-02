import { ApiProperty } from '@nestjs/swagger';

import { EstadoUsuario } from '../../enums/estados-usuarios.enum.js';

/**
 * DTO que representa la información detallada de un médico.
 *
 * Se utiliza para devolver los datos de un médico,
 * incluyendo su información profesional y el valor de su consulta.
 */
export class MedicoDTO {

    /**
     * Identificador único del médico.
     */
    @ApiProperty({
        example: 1,
        description: 'Identificador único del médico.',
    })
    id: number;

    /**
     * Nombre completo del médico.
     */
    @ApiProperty({
        example: 'Dr. Gregory House',
        description: 'Nombre completo del médico.',
    })
    nombre: string;

    /**
     * Correo electrónico del médico.
     */
    @ApiProperty({
        example: 'house@clinic.com',
        description: 'Correo electrónico del médico.',
    })
    email: string;

    /**
     * Número de matrícula profesional del médico.
     */
    @ApiProperty({
        example: 12345,
        description: 'Número de matrícula profesional del médico.',
    })
    matricula: number;

    /**
     * Valor actual de la consulta médica.
     */
    @ApiProperty({
        example: 15000,
        description: 'Valor actual de la consulta médica.',
        type: Number,
    })
    valor_consulta: number;

    /**
     * Estado actual del usuario asociado al médico.
     */
    @ApiProperty({
        enum: EstadoUsuario,
        example: EstadoUsuario.ACTIVO,
        description: 'Estado del usuario asociado al médico.',
    })
    estado: EstadoUsuario;

}