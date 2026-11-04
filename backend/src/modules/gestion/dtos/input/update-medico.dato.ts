import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

/**
 * DTO utilizado para recibir los datos que se pueden modificar
 * de un médico desde el módulo de gestión.
 *
 * Actualmente, permite actualizar únicamente el valor de la consulta.
 */
export class UpdateMedicoDto {
    /**
     * Nuevo valor monetario de la consulta médica.
     *
     * Debe ser un número entero mayor que cero.
     */
    @ApiProperty({
        description: 'Nuevo valor de la consulta médica.',
        example: 20000,
        minimum: 1,
        type: Number,
    })
    @Type(() => Number)
    @IsInt({
        message: 'El valor de la consulta debe ser un número entero',
    })
    @Min(1, {
        message: 'El valor de la consulta debe ser mayor que cero',
    })
    valor_consulta!: number;
}