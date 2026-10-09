import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity.js';
import { Reserva } from './reserva.entity.js';

@Entity('pacientes') // Si deciden separar la tabla de pacientes
export class Paciente {
    @PrimaryGeneratedColumn()
    id: number; // Clave primaria (PK) del paciente

    @Column()
    id_usuario: number; // Foreign Key (FK) hacia la tabla usuarios

    // Relación OneToOne con la entidad Usuario
    // Vincula los datos de inicio de sesión/personales del usuario con su rol de paciente
    @OneToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    // Relación OneToMany: Un paciente puede tener muchas reservas de turnos
    @OneToMany(() => Reserva, (reserva) => reserva.paciente)
    reservas: Reserva[];
}