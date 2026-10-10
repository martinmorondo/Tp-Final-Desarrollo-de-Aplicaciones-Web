import { EstadoUsuario } from '../enums/estado-usuario.enum.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';
export declare class Usuario {
    id: number;
    documento: string;
    apellidos: string;
    nombres: string;
    email: string;
    clave: string;
    estado: EstadoUsuario;
    rol: RolUsuario;
}
