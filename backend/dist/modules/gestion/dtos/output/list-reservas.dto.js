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
import { EstadoReserva } from "../../enums/estados-reserva.enum.js";
import { ListPacienteDTO } from "./list-paciente.dto.js";
export class ListReservasDTO {
    id;
    nombre;
    estado;
    paciente;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ListReservasDTO.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ListReservasDTO.prototype, "nombre", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ListReservasDTO.prototype, "estado", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", ListPacienteDTO)
], ListReservasDTO.prototype, "paciente", void 0);
//# sourceMappingURL=list-reservas.dto.js.map