
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

/**
 * DTO de salida del inicio de sesión.
 */
export class LoginResponseDTO {
    @ApiProperty({
        description: 'Token JWT que se envía en el encabezado Authorization como Bearer.',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        type: String,
    })
    @IsString()
    @MinLength(1)
    accessToken!: string;
}
