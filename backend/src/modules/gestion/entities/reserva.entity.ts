import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import type { ValueTransformer } from 'typeorm';;


import { Medico } from './medico.entity.js';
import { Usuario } from './usuario.entity.js';
import { EstadoReserva } from '../enums/estados-reserva.enum.js';

const decimalTransformer: ValueTransformer = {
    to: (value: number): number => value,
    from: (value: string | number): number => Number(value),
};

@Entity('reservas')
export class Reserva {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_medico: number;

    @ManyToOne(() => Medico, (medico) => medico.reservas)
    @JoinColumn({ name: 'id_medico' })
    medico: Medico;

    @Column()
    id_paciente: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Usuario;

    @Column({ type: 'timestamp' })
    fecha_hora: Date;

    @Column({
        type: 'enum',
        enum: EstadoReserva,
        default: EstadoReserva.ACTIVO,
    })
    estado: EstadoReserva;

    @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
})
valor_consulta: number;

}
