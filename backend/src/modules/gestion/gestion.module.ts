import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';

import { Usuario } from './entities/usuario.entity.js';
import { Medico } from './entities/medico.entity.js';
import { Reserva } from './entities/reserva.entity.js';

import { UsuarioService } from './services/usuario.service.js';
import { MedicoService } from './services/medico.service.js';
import { ReservasService } from './services/reservas.service.js';

import { MedicoController } from './controllers/medicos.controller.js';
import { ReservasController } from './controllers/reserva.controller.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario, Medico, Reserva]),
         AuthModule,
    ],
    controllers: [
        MedicoController,
        ReservasController,
    ],
    providers: [
        UsuarioService,
        MedicoService,
        ReservasService,
    ],
    exports: [
        UsuarioService,
        MedicoService,
        ReservasService,
    ],
})
export class GestionModule {}