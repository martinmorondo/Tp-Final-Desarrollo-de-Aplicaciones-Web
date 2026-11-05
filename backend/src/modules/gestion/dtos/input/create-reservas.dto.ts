
import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
    IsDefined,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    Matches,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'fechaLocalValida', async: false })
class FechaLocalValida implements ValidatorConstraintInterface {
    validate(valor: string): boolean {
        if (typeof valor !== 'string') return false;

        const coincidencia = valor.match(
            /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/,
        );

        if (!coincidencia) return false;

        const [, anio, mes, dia, hora, minuto, segundo] = coincidencia;

        const fecha = new Date(
            Number(anio),
            Number(mes) - 1,
            Number(dia),
            Number(hora),
            Number(minuto),
            Number(segundo),
        );

        return (
            fecha.getFullYear() === Number(anio) &&
            fecha.getMonth() === Number(mes) - 1 &&
            fecha.getDate() === Number(dia) &&
            fecha.getHours() === Number(hora) &&
            fecha.getMinutes() === Number(minuto) &&
            fecha.getSeconds() === Number(segundo)
        );
    }

    defaultMessage(): string {
        return 'La fecha y hora deben ser válidas y tener el formato YYYY-MM-DDTHH:mm:ss, sin zona horaria';
    }
}

/**
 * DTO utilizado para recibir los datos necesarios
 * para registrar una nueva reserva de turno médico.
 */
export class CreateReservasDto {

    @ApiProperty({
        description: 'Identificador del médico al que se solicita el turno.',
        example: 1,
        type: Number,
    })
    @IsDefined({ message: 'El ID del médico es obligatorio' })
    @Type(() => Number)
    @IsInt({ message: 'El ID del médico debe ser un número entero' })
    @IsPositive({ message: 'El ID del médico debe ser positivo' })
    id_medico!: number;

    @ApiProperty({
        description: 'Fecha y hora local del turno, sin zona horaria.',
        example: '2026-11-10T09:00:00',
        type: String,
    })
    @IsDefined({ message: 'La fecha y hora del turno son obligatorias' })
    @IsString({ message: 'La fecha y hora deben ser un texto' })
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
    @Validate(FechaLocalValida)
    fecha_hora!: string;

    @ApiPropertyOptional({
        description: 'Identificador del paciente para quien se reserva el turno. Es obligatorio cuando la reserva la realiza un administrador. Los pacientes reservan para sí mismos.',
        example: 2,
        type: Number,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'El ID del paciente debe ser un número entero' })
    @IsPositive({ message: 'El ID del paciente debe ser positivo' })
    id_paciente?: number;
}
