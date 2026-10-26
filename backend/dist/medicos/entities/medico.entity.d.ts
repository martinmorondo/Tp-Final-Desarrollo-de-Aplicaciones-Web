import type { Relation } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity.js';
import { Reserva } from '../../reservas/entities/reserva.entity.js';
export declare class Medico {
    id: number;
    usuario: Relation<Usuario>;
    matricula: number;
    valor_consulta: number;
    reservas: Relation<Reserva>[];
}
