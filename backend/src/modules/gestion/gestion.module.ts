import { Module } from "@nestjs/common";
import { MedicoController } from "./controllers/medicos.controller.js";
import { PacienteController } from "./controllers/paciente.controller.js";
import { UsuarioController } from "./controllers/usuarios.controller.js";
import { AdministradorController } from "./controllers/administrador.controller.js";
import { ReservasController } from "./controllers/reserva.controller.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Medico } from "./entities/medico.entity.js";
import { Paciente } from "./entities/paciente.entity.js";
import { Usuario } from "./entities/usuario.entity.js";
import { Administrador } from "./entities/administrador.entity.js";
import { Reserva } from "./entities/reserva.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([Medico, Paciente, Usuario, Administrador, Reserva])],
    controllers: [MedicoController, PacienteController, UsuarioController, AdministradorController, ReservasController],
    providers: [],
    exports: []
})
export class GestionModule {

}