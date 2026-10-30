import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from '../entities/usuario.entity.js';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly repository: Repository<Usuario>,
    ) {}

    async obtenerPorId(id: number): Promise<Usuario> {
        const usuario = await this.repository.findOneBy({ id });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }
}