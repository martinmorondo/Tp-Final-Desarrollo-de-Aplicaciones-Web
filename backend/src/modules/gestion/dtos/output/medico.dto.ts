import { ApiProperty } from '@nestjs/swagger';
import { EstadoUsuario } from '../../enums/estados-usuarios.enum.js';

export class MedicoDTO {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Dr. Gregory House' })
    nombre: string;

    @ApiProperty({ example: 'house@clinic.com' })
    email: string;

    @ApiProperty({ example: 'MN-12345' })
    matricula: string;

    @ApiProperty({ example: 15000.0 })
    valor_consulta: number;

    @ApiProperty({ enum: EstadoUsuario, example: EstadoUsuario.ACTIVO })
    estado: EstadoUsuario;
}