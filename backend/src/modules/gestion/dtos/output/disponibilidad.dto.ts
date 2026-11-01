import { ApiProperty } from '@nestjs/swagger';

export class DisponibilidadDTO {
    @ApiProperty({ example: '2026-11-10' })
    fecha!: string;

    @ApiProperty({
        example: [8, 9, 11],
        description: 'Horas de inicio de los turnos libres',
    })
    horas_libres!: number[];
}