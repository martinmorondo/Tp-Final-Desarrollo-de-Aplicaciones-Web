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

  async buscarUsuarioActivoPorEmail(email: string): Promise<Usuario | null> {
    return this.repository.findOne({
      where: { email, estado: EstadoUsuario.ACTIVO },
    });
  }

  async buscarUsuarioActivoPorId(id: number): Promise<Usuario | null> {
    return this.repository.findOne({
      where: { id, estado: EstadoUsuario.ACTIVO },
    });
  }
}