import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateMedicoDto {
    @ApiPropertyOptional({
        description: 'Nuevo valor de la consulta médica',
        example: 20000,
        minimum: 0.01,
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