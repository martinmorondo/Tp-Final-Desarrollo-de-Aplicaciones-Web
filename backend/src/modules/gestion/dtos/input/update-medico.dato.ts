
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { OmitType } from '@nestjs/mapped-types';
import { CreateMedicoDto } from './create-medico.dto.js';
import { EstadoUsuario } from '../../enums/estados-usuarios.enum.js';

export class UpdateMedicoDto extends PartialType(
    OmitType(CreateMedicoDto, ['id_usuario'] as const),
) {
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
