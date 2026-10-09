import { ApiProperty } from "@nestjs/swagger";
import { EstadoUsuario } from "../../enums/estados-usuarios.enum.js";

export class ListMedicoDTO {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    nombre!: string;

    @ApiProperty()
    estado!: EstadoUsuario;

}