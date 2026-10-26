import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUsuarioDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre!: string;

}