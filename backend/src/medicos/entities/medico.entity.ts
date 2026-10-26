import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm'; 
import { Usuario } from '../../usuarios/entities/usuario.entity.js';
import { Reserva } from '../../reservas/entities/reserva.entity.js';

@Entity('medicos')
export class Medico {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Relation<Usuario>;

  @Column({ type: 'int' })
  matricula: number;

  @Column({ type: 'int' })
  valor_consulta: number;

  @OneToMany(() => Reserva, reserva => reserva.medico)
  reservas: Relation<Reserva>[];
}