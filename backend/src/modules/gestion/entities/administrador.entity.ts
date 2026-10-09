import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity.js';

@Entity('administradores') // Si deciden separar la tabla de administradores
export class Administrador {
    @PrimaryGeneratedColumn()
    id: number; // Clave primaria (PK) del administrador

    @Column()
    id_usuario: number; // Foreign Key (FK) hacia la tabla usuarios

    // Relación OneToOne con la entidad Usuario
    // Vincula los datos del usuario administrador
    @OneToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;
}