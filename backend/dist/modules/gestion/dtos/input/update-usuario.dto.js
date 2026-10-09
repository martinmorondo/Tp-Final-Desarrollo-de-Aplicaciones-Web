var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { CreateUsuarioDto } from "./create-usuario.dto.js";
import { EstadoUsuario } from "../../enums/estados-usuarios.enum.js";
export class UpdateUsuarioDto extends CreateUsuarioDto {
    estado;
}
__decorate([
    ApiProperty({ enum: EstadoUsuario, example: EstadoUsuario.ACTIVO }),
    IsEnum(EstadoUsuario),
    IsNotEmpty(),
    __metadata("design:type", String)
], UpdateUsuarioDto.prototype, "estado", void 0);
//# sourceMappingURL=update-usuario.dto.js.map