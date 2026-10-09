import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity.js';
import { Reserva } from './reserva.entity.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';

@Entity('medicos') // Nombre de la tabla en PostgreSQL según el PDF
export class Medico {
    @PrimaryGeneratedColumn()
    id: number; // Clave primaria (PK) del médico

    @Column({ name: 'id_usuario' })
    id_usuario: number; // Foreign Key (FK) hacia la tabla usuarios

    @Column({ type: 'int' })
    matricula: number; // Matrícula del médico según el PDF

    @Column({ type: 'int' })
    valor_consulta: number; // Valor de la consulta según el PDF

    // Relación con la tabla usuarios según el diagrama
    @OneToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    // Propiedades auxiliares que usa tu servicio:
    // Como en tu servicio usás 'm.nombre' y 'm.estado', o campos como 'id_medico',
    // podés mapear getters o columnas según las necesites en tus DTOs.
    
    // Relación con las reservas
    @OneToMany(() => Reserva, (reserva) => reserva.medico)
    reservas: Reserva[];

    // Getter para obtener el nombre completo desde el usuario asociado
    get nombre(): string {
        return this.usuario ? `${this.usuario.nombres} ${this.usuario.apellidos}` : '';
    }

    // Getter para obtener el estado desde el usuario asociado (segun el PDF, el estado está en usuarios)
    get estado(): EstadoUsuario {
        return this.usuario ? this.usuario.estado : EstadoUsuario.ACTIVO;
    }

    // Alias id_medico para mantener compatibilidad con el servicio
    get id_medico(): number {
        return this.id;
    }
}