import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column({ type: 'text', unique: true })
    documento: string; 

    @Column({ type: 'text' })
    apellidos: string;

    @Column({ type: 'text' })
    nombres: string;

    @Column({ type: 'text' })
    email: string;

    @Column({ type: 'text' })
    clave: string; 

    @Column({
        type: 'enum',
        enum: EstadoUsuario,
        default: EstadoUsuario.ACTIVO,
    })
    estado: EstadoUsuario;

    @Column({
        type: 'enum',
        enum: RolUsuario,
    })
    rol: RolUsuario;
}