import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';

import type { ValueTransformer } from 'typeorm';
import type { Usuario } from './usuario.entity.js';
import type { Reserva } from './reserva.entity.js';

const decimalTransformer: ValueTransformer = {
    to: (value: number): number => value,
    from: (value: string | number): number => Number(value),
};

@Entity('medicos')
export class Medico {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_usuario: number;

    @Column()
    matricula: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: decimalTransformer,
    })
    valor_consulta: number;

    @OneToOne('Usuario', (usuario: any) => usuario.medico, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    @OneToMany('Reserva', (reserva: any) => reserva.medico)
    reservas: Reserva[];
}
