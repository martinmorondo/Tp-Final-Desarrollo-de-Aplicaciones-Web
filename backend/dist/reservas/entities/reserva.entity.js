var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Medico } from '../../medicos/entities/medico.entity.js';
import { Usuario } from '../../usuarios/entities/usuario.entity.js';
import { EstadoReserva } from '../enums/estado-reserva.enum.js';
let Reserva = class Reserva {
    id;
    medico;
    paciente;
    fecha_hora;
    estado;
    valor_consulta;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Reserva.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Medico, medico => medico.reservas),
    JoinColumn({ name: 'id_medico' }),
    __metadata("design:type", Object)
], Reserva.prototype, "medico", void 0);
__decorate([
    ManyToOne(() => Usuario),
    JoinColumn({ name: 'id_paciente' }),
    __metadata("design:type", Object)
], Reserva.prototype, "paciente", void 0);
__decorate([
    Column({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Reserva.prototype, "fecha_hora", void 0);
__decorate([
    Column({ type: 'enum', enum: EstadoReserva }),
    __metadata("design:type", String)
], Reserva.prototype, "estado", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], Reserva.prototype, "valor_consulta", void 0);
Reserva = __decorate([
    Entity('reservas')
], Reserva);
export { Reserva };
//# sourceMappingURL=reserva.entity.js.map