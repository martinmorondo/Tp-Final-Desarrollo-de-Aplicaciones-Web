import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMedicoDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre!: string;

}