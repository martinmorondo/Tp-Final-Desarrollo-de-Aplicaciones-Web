import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateMedicoDto } from './create-medico.dto.js';
import { EstadoUsuario } from '../../enums/estados-usuarios.enum.js';

export class UpdateMedicoDto extends PartialType(CreateMedicoDto) {
    @ApiPropertyOptional({
        description: 'Número de matrícula profesional',
        example: 'MN-99999',
    })
    matricula?: string;

    @ApiPropertyOptional({
        description: 'Nuevo valor de la consulta médica',
        example: 20000.0,
    })
    valor_consulta?: number;

    @ApiPropertyOptional({
        enum: EstadoUsuario,
        description: 'Estado del usuario/médico',
    })
    estado?: EstadoUsuario;
}