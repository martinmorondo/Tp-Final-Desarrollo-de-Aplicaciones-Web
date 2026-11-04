import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';

import type { Usuario } from './usuario.entity.js';
import type { Reserva } from './reserva.entity.js';

@Entity('medicos')
export class Medico {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_usuario: number;

    @Column({ type: 'varchar', length: 20 })
    matricula: string;

    @Column({ type: 'int' })
    valor_consulta: number;

    @OneToOne('Usuario', (usuario: any) => usuario.medico, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    @OneToMany('Reserva', (reserva: any) => reserva.medico)
    reservas: Reserva[];
}
