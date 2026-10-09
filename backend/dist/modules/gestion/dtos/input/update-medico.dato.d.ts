import { CreateMedicoDto } from "./create-medico.dto.js";
import { EstadoUsuario } from "../../enums/estados-usuarios.enum.js";
export declare class UpdateMedicoDto extends CreateMedicoDto {
    estado: EstadoUsuario;
}
