import { EstadoReserva } from "../../enums/estados-reserva.enum.js";
import { ListPacienteDTO } from "./list-paciente.dto.js";
export declare class ListReservasDTO {
    id: number;
    nombre: string;
    estado: EstadoReserva;
    paciente: ListPacienteDTO;
}
