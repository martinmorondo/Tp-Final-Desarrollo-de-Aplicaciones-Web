import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsNumber, IsOptional, Min } from 'class-validator';

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
     * Debe ser un número mayor que cero y admite hasta dos decimales.
     */
    @ApiPropertyOptional({
        description: 'Nuevo valor de la consulta médica.',
        example: 20000,
        minimum: 0.01,
        type: Number,
    })
    @IsOptional()
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'El valor de la consulta debe ser un número con hasta dos decimales' },
    )
    @Min(0.01, {
        message: 'El valor de la consulta debe ser mayor que cero',
    })
    valor_consulta?: number;

}