import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity.js';
export declare class UsuariosService {
    private readonly usuarioRepository;
    constructor(usuarioRepository: Repository<Usuario>);
}
