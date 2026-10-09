import { CreateAdministradorDto } from "./create-administrador.dto.js";
import { EstadoUsuario } from "../../enums/estados-usuarios.enum.js";
export declare class UpdateAdministradorDto extends CreateAdministradorDto {
    estado: EstadoUsuario;
}
