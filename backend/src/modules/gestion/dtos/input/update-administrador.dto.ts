import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { CreateAdministradorDto } from "./create-administrador.dto.js";
import { EstadoUsuario } from "../../enums/estados-usuarios.enum.js";

export class UpdateAdministradorDto extends CreateAdministradorDto {

    @ApiProperty({ enum: EstadoUsuario, example: EstadoUsuario.ACTIVO })
    @IsEnum(EstadoUsuario)
    @IsNotEmpty()
    estado!: EstadoUsuario;

}