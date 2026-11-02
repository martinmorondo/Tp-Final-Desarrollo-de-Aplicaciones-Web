import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import type { Medico } from './medico.entity.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';


@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    documento: string;

    @Column()
    apellidos: string;

    @Column()
    nombres: string;

    @Column()
    email: string;

    @Column()
    clave: string;

    @Column({ type: 'enum', enum: EstadoUsuario, enumName: 'estados_usuarios', default: EstadoUsuario.ACTIVO })
    estado: EstadoUsuario;

    @Column({ type: 'enum', enum: RolUsuario, enumName: 'roles_usuarios' })
    rol: RolUsuario;

    @OneToOne('Medico', (medico: any) => medico.usuario)
    medico?: Medico;
}