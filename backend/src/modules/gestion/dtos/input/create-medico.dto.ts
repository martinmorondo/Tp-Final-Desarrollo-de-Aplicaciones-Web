import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateMedicoDto {
    @ApiProperty({
        description: 'ID del usuario asociado al perfil de médico',
        example: 1,
    })
    @IsNotEmpty({ message: 'El ID de usuario es obligatorio' })
    @IsNumber({}, { message: 'El ID de usuario debe ser numérico' })
    id_usuario: number;

    @ApiProperty({
        description: 'Número de matrícula profesional',
        example: 'MN-12345',
    })
    @IsNotEmpty({ message: 'La matrícula es obligatoria' })
    @IsString({ message: 'La matrícula debe ser una cadena de texto' })
    matricula: string;

    @ApiProperty({
        description: 'Tarifa base fija de la consulta médica',
        example: 15000.0,
    })
    @IsNotEmpty({ message: 'El valor de la consulta es obligatorio' })
    @IsNumber({}, { message: 'El valor de la consulta debe ser numérico' })
    @Min(0, { message: 'El valor de la consulta no puede ser negativo' })
    valor_consulta: number;
}