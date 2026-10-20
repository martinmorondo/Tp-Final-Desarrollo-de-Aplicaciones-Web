import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { CreateUsuarioDto } from "./create-usuario.dto.js";
import { EstadoUsuario } from "../../enums/estados-usuarios.enum.js";

export class UpdateUsuarioDto extends CreateUsuarioDto {

    @ApiProperty({ enum: EstadoUsuario, example: EstadoUsuario.ACTIVO })
    @IsEnum(EstadoUsuario)
    @IsNotEmpty()
    estado!: EstadoUsuario;

}