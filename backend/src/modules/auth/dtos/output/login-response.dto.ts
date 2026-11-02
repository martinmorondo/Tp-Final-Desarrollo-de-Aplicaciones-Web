import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de salida del inicio de sesión.
 */
export class LoginResponseDTO {

    /**
     * Token JWT para autenticar las solicitudes siguientes.
     */
    @ApiProperty({
        description: 'Token JWT que se envía en el encabezado Authorization como Bearer.',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        type: String,
    })
    accessToken!: string;
}