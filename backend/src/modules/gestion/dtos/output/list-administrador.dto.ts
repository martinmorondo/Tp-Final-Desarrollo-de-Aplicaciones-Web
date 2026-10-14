import { ApiProperty } from "@nestjs/swagger";
import { EstadoUsuario } from "../../enums/estados-usuarios.enum.js";

export class ListAdministradorDTO {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    nombre!: string;

    @ApiProperty()
    estado!: EstadoUsuario;

}