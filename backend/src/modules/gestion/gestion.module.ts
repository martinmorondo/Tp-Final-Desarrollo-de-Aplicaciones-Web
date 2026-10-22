import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades
import { Usuario } from './entities/usuario.entity.js';
import { Medico } from './entities/medico.entity.js';
import { Reserva } from './entities/reserva.entity.js';

// Servicios
import { UsuarioService } from './services/usuario.service.js';
import { MedicoService } from './services/medico.service.js';
import { ReservasService } from './services/reservas.service.js';

// Controladores
import { MedicoController } from './controllers/medicos.controller.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario, Medico, Reserva]),
    ],
    controllers: [
        MedicoController,
    ],
    providers: [
        UsuarioService,
        MedicoService,
        ReservasService,
        {
        provide: Symbol.for('UsuarioService'),
        useExisting: UsuarioService,
        },
        {
        provide: Symbol.for('MedicoService'),
        useExisting: MedicoService,
        },
        {
        provide: Symbol.for('ReservasService'),
        useExisting: ReservasService,
        },
    ],
    exports: [
        UsuarioService,
        MedicoService,
        ReservasService,
    ],
})
export class GestionModule {}