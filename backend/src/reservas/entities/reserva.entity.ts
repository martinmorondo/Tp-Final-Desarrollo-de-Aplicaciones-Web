import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm'; 
import { Medico } from '../../medicos/entities/medico.entity.js';
import { Usuario } from '../../usuarios/entities/usuario.entity.js';
import { EstadoReserva } from '../enums/estado-reserva.enum.js';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Medico, medico => medico.reservas)
  @JoinColumn({ name: 'id_medico' })
  medico: Relation<Medico>;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_paciente' })
  paciente: Relation<Usuario>;

  @Column({ type: 'timestamp' })
  fecha_hora: Date;

  @Column({ type: 'enum', enum: EstadoReserva })
  estado: EstadoReserva;

  @Column({ type: 'int' })
  valor_consulta: number;
}