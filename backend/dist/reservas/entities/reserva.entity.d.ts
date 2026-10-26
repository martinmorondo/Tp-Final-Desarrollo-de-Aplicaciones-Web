import type { Relation } from 'typeorm';
import { Medico } from '../../medicos/entities/medico.entity.js';
import { Usuario } from '../../usuarios/entities/usuario.entity.js';
import { EstadoReserva } from '../enums/estado-reserva.enum.js';
export declare class Reserva {
    id: number;
    medico: Relation<Medico>;
    paciente: Relation<Usuario>;
    fecha_hora: Date;
    estado: EstadoReserva;
    valor_consulta: number;
}
