import { ApiProperty } from "@nestjs/swagger";
import { EstadoReserva } from "../../enums/estados-reserva.enum.js";
import { ListPacienteDTO } from "./list-paciente.dto.js";

export class ListReservasDTO {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    nombre!: string;

    @ApiProperty()
    estado!: EstadoReserva;

    @ApiProperty()
    paciente!: ListPacienteDTO;

}