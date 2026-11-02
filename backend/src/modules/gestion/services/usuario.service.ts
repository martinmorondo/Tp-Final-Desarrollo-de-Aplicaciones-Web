import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from '../entities/usuario.entity.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';
import { ListPacienteDTO } from '../dtos/output/list-paciente.dto.js';

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

    /**
     * Obtiene los pacientes activos, ordenados por apellido y nombre.
     * Lo utiliza el administrador para elegir a quién le reserva un turno.
     */
    async obtenerPacientes(): Promise<ListPacienteDTO[]> {
        const pacientes = await this.repository.find({
            where: { rol: RolUsuario.PACIENTE, estado: EstadoUsuario.ACTIVO },
            order: { apellidos: 'ASC', nombres: 'ASC' },
        });

        return pacientes.map((paciente) => {
            const dto = new ListPacienteDTO();
            dto.id = paciente.id;
            dto.nombre = `${paciente.nombres} ${paciente.apellidos}`;
            return dto;
        });
    }
}
