import { CreateUsuarioDto } from "./create-usuario.dto.js";
import { EstadoUsuario } from "../../enums/estados-usuarios.enum.js";
export declare class UpdateUsuarioDto extends CreateUsuarioDto {
    estado: EstadoUsuario;
}
