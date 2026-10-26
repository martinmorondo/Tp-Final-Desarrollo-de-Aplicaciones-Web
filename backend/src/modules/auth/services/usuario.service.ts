
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../gestion/entities/usuario.entity.js';
import { EstadoUsuario } from '../../gestion/enums/estados-usuarios.enum.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
  ) {}

  async buscarUsuarioActivoPorNombre(
    nombre: string,
  ): Promise<Usuario | null> {
    return this.repository.findOne({
      where: [
        { nombres: nombre, estado: EstadoUsuario.ACTIVO },
        { email: nombre, estado: EstadoUsuario.ACTIVO },
      ],
    });
  }
}
