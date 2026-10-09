import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { EstadoUsuario } from "../enums/estados-usuarios.enum.js";

@Entity({name: "usuarios"})
export class Usuario{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column()
    clave: string

    @Column({type: "enum", enum: EstadoUsuario})
    estado: EstadoUsuario


}