var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EstadoUsuario } from '../enums/estado-usuario.enum.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';
let Usuario = class Usuario {
    id;
    documento;
    apellidos;
    nombres;
    email;
    clave;
    estado;
    rol;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Usuario.prototype, "id", void 0);
__decorate([
    Column({ type: 'text', unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "documento", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], Usuario.prototype, "apellidos", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], Usuario.prototype, "nombres", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], Usuario.prototype, "clave", void 0);
__decorate([
    Column({ type: 'enum', enum: EstadoUsuario }),
    __metadata("design:type", String)
], Usuario.prototype, "estado", void 0);
__decorate([
    Column({ type: 'enum', enum: RolUsuario }),
    __metadata("design:type", String)
], Usuario.prototype, "rol", void 0);
Usuario = __decorate([
    Entity('usuarios')
], Usuario);
export { Usuario };
//# sourceMappingURL=usuario.entity.js.map