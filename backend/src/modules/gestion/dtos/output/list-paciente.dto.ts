
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class ListPacienteDTO {
    @ApiProperty({
        example: 15,
        description: 'Identificador único del paciente.',
    })
    @IsInt()
    @Min(1)
    id!: number;

    @ApiProperty({
        example: 'Juan Pérez',
        description: 'Nombre completo del paciente.',
    })
    @IsString()
    @MinLength(1)
    nombre!: string;
}
