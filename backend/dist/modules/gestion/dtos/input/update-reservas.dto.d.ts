import { CreateReservasDto } from "./create-reservas.dto.js";
import { EstadoReserva } from "../../enums/estados-reserva.enum.js";
export declare class UpdateReservasDto extends CreateReservasDto {
    estado: EstadoReserva;
}
