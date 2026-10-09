import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { CreatePacienteDto } from "./create-paciente.dto.js";
import { EstadoUsuario } from "../../enums/estados-usuarios.enum.js";

export class UpdatePacienteDto extends CreatePacienteDto {

    @ApiProperty({ enum: EstadoUsuario, example: EstadoUsuario.ACTIVO })
    @IsEnum(EstadoUsuario)
    @IsNotEmpty()
    estado!: EstadoUsuario;

}