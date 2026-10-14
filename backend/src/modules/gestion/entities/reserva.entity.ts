import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Medico } from './medico.entity.js';
import { Usuario } from './usuario.entity.js';
import { EstadoReserva } from '../enums/estados-reserva.enum.js';


@Entity('reservas') // Nombre de la tabla en PostgreSQL
export class Reserva {
    @PrimaryGeneratedColumn()
    id: number; // Clave primaria (PK)

    @Column()
    id_medico: number; // FK hacia la tabla medicos

    // Relación ManyToOne: Muchas reservas pertenecen a un mismo médico
    @ManyToOne(() => Medico, (medico) => medico.reservas)
    @JoinColumn({ name: 'id_medico' })
    medico: Medico;

    @Column()
    id_paciente: number; // FK hacia la tabla usuarios (donde el rol es PACIENTE)

    // Relación ManyToOne: Muchas reservas pertenecen a un mismo paciente
    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Usuario;

    @Column({ type: 'timestamp' })
    fecha_hora: Date; // Fecha y hora de la cita programada

    @Column({
        type: 'enum',
        enum: EstadoReserva,
        default: EstadoReserva.ACTIVO,
    })
    estado: EstadoReserva; // Estado actual de la reserva

    @Column({ type: 'int' })
    valor_consulta: number; // Valor congelado al momento de reservar (Regla de Negocio)
}