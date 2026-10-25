import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EstadoUsuario } from '../enums/estado-usuario.enum.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';

@Entity('usuarios') // Nombre exacto de la tabla según el modelo
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

  @Column({ type: 'enum', enum: EstadoUsuario })
  estado: EstadoUsuario;

  @Column({ type: 'enum', enum: RolUsuario })
  rol: RolUsuario;
}