
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO utilizado para recibir las credenciales de un usuario
 * durante el proceso de autenticación.
 */
export class LoginDTO {
    /**
     * Correo electrónico utilizado para iniciar sesión.
     */
    @ApiProperty({
        description: 'Correo electrónico del usuario.',
        example: 'paciente@clinica.com',
        type: String,
    })
    @IsEmail({}, { message: 'Se debe indicar un correo electrónico válido' })
    @IsNotEmpty({ message: 'Se debe indicar el correo electrónico' })
    email: string;

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
