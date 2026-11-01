import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO utilizado para recibir las credenciales de un usuario
 * durante el proceso de autenticación.
 */
export class LoginDTO {

    /**
     * Nombre o correo electrónico utilizado para iniciar sesión.
     */
    @ApiProperty({
        description: 'Nombre o correo electrónico del usuario.',
        example: 'paciente@clinica.com',
        type: String,
    })
    @IsString()
    @IsNotEmpty({ message: 'Se debe indicar el nombre' })
    nombre: string;

    /**
     * Contraseña del usuario.
     */
    @ApiProperty({
        description: 'Contraseña correspondiente a la cuenta del usuario.',
        example: '********',
        type: String,
        format: 'password',
    })
    @IsString()
    @IsNotEmpty()
    clave: string;

}