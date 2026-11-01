import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Medico } from './medico.entity.js';
import { Usuario } from './usuario.entity.js';
import { EstadoReserva } from '../enums.js';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: 'id_medico' })
  medico: Medico;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_paciente' })
  paciente: Usuario;

  @Column({ type: 'timestamp' })
  fecha_hora: Date;

  @Column({ type: 'enum', enum: EstadoReserva, default: EstadoReserva.ACTIVO })
  estado: EstadoReserva;

  @Column({ type: 'int' })
  valor_consulta: number;
}

