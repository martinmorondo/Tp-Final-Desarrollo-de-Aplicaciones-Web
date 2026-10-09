import { CreatePacienteDto } from "./create-paciente.dto.js";
import { EstadoUsuario } from "../../enums/estados-usuarios.enum.js";
export declare class UpdatePacienteDto extends CreatePacienteDto {
    estado: EstadoUsuario;
}
