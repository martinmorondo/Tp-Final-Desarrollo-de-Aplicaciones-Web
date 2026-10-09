import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { CreateMedicoDto } from "./create-medico.dto.js";
import { EstadoUsuario } from "../../enums/estados-usuarios.enum.js";

export class UpdateMedicoDto extends CreateMedicoDto {

    @ApiProperty({ enum: EstadoUsuario, example: EstadoUsuario.ACTIVO })
    @IsEnum(EstadoUsuario)
    @IsNotEmpty()
    estado!: EstadoUsuario;

}