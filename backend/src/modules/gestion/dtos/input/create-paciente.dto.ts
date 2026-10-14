import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePacienteDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre!: string;

}