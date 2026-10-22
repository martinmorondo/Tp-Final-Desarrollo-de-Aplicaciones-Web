import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import type { Usuario } from './usuario.entity.js'; // Importamos como 'type' para evitar el ciclo en runtime

@Entity('medicos')
export class Medico {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_usuario: number;

    @Column()
    matricula: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valor_consulta: number;

    @OneToOne('Usuario', (usuario: any) => usuario.medico, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;
}