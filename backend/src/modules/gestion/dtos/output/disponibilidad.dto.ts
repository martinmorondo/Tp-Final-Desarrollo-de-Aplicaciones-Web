
import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsInt,
    IsString,
    Matches,
    Max,
    Min,
} from 'class-validator';

export class DisponibilidadDTO {
    @ApiProperty({
        example: '2026-11-10',
        description: 'Fecha consultada en formato YYYY-MM-DD.',
    })
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    fecha!: string;

    @ApiProperty({
        example: [8, 9, 11],
        description: 'Horas de inicio de los turnos libres.',
    })
    @IsArray()
    @IsInt({ each: true })
    @Min(8, { each: true })
    @Max(15, { each: true })
    horas_libres!: number[];
}
