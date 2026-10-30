import { ApiProperty } from '@nestjs/swagger';

export class ListPacienteDTO {
    @ApiProperty({ example: 15 })
    id!: number;

    @ApiProperty({ example: 'Juan Pérez' })
    nombre!: string;
}