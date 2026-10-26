var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity.js';
import { Reserva } from '../../reservas/entities/reserva.entity.js';
let Medico = class Medico {
    id;
    usuario;
    matricula;
    valor_consulta;
    reservas;
};
__decorate([
    PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], Medico.prototype, "id", void 0);
__decorate([
    OneToOne(() => Usuario),
    JoinColumn({ name: 'id_usuario' }),
    __metadata("design:type", Object)
], Medico.prototype, "usuario", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], Medico.prototype, "matricula", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], Medico.prototype, "valor_consulta", void 0);
__decorate([
    OneToMany(() => Reserva, reserva => reserva.medico),
    __metadata("design:type", Array)
], Medico.prototype, "reservas", void 0);
Medico = __decorate([
    Entity('medicos')
], Medico);
export { Medico };
//# sourceMappingURL=medico.entity.js.map