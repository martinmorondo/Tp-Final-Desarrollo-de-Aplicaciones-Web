import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { CreateReservasDto } from "./create-reservas.dto.js";
import { EstadoReserva  } from "../../enums/estados-reserva.enum.js";

export class UpdateReservasDto extends CreateReservasDto {

    @ApiProperty({
        enum: EstadoReserva,
        example: EstadoReserva.ACTIVO
    })
    @IsEnum(EstadoReserva)
    @IsNotEmpty()
    estado!: EstadoReserva;

}