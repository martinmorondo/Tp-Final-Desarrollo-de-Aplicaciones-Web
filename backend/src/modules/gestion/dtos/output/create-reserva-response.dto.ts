
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateReservaResponseDTO {
    @ApiProperty({
        example: 1,
        description: 'Identificador de la reserva creada.',
    })
    @IsInt()
    @Min(1)
    id!: number;
}
