import { ApiProperty } from "@nestjs/swagger";
import { EstadoReserva } from "../../enums/estados-reserva.enum.js";

export class ReservaDTO {

    @ApiProperty()
    nombre!: string;

    @ApiProperty()
    estado!: EstadoReserva;

    @ApiProperty()
    paciente!: string;

}