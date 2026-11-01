import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Medico } from '../entities/medico.entity.js';
import { UpdateMedicoDto } from '../dtos/input/update-medico.dato.js';
import { ListMedicoDTO } from '../dtos/output/list-medico.dto.js';
import { MedicoDTO } from '../dtos/output/medico.dto.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';

@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(Medico)
        private readonly repository: Repository<Medico>,
    ) {}

    async obtenerMedicos(estado?: EstadoUsuario): Promise<ListMedicoDTO[]> {
        const medicos = await this.repository.find({
            relations: { usuario: true },
            where: estado ? { usuario: { estado } } : {},
            order: { id: 'ASC' },
        });

        return medicos.map((medico) => {
            const dto = new ListMedicoDTO();

            dto.id = medico.id;
            dto.matricula = medico.matricula;
            dto.valor_consulta = medico.valor_consulta;

            if (medico.usuario) {
                dto.nombre = `${medico.usuario.nombres} ${medico.usuario.apellidos}`;
                dto.estado = medico.usuario.estado;
            }

            return dto;
        });
    }

    async obtenerMedico(id: number): Promise<MedicoDTO> {
        const medico = await this.repository.findOne({
            where: { id },
            relations: { usuario: true },
        });

        if (!medico) {
            throw new NotFoundException('Médico no encontrado');
        }

        const dto = new MedicoDTO();

        dto.id = medico.id;
        dto.matricula = medico.matricula;
        dto.valor_consulta = medico.valor_consulta;

        if (medico.usuario) {
            dto.nombre = `${medico.usuario.nombres} ${medico.usuario.apellidos}`;
            dto.email = medico.usuario.email;
            dto.estado = medico.usuario.estado;
        }

        return dto;
    }

    async obtenerPorId(id: number): Promise<Medico> {
        const medico = await this.repository.findOne({
            where: { id },
            relations: { usuario: true },
        });

        if (!medico) {
            throw new NotFoundException('Médico no encontrado');
        }

        return medico;
    }

    async obtenerPorUsuario(idUsuario: number): Promise<Medico> {
        const medico = await this.repository.findOne({
            where: { id_usuario: idUsuario },
            relations: { usuario: true },
        });

        if (!medico) {
            throw new NotFoundException(
                'No se encontró un perfil médico para este usuario',
            );
        }

        return medico;
    }

    async actualizarMedico(id: number, dto: UpdateMedicoDto): Promise<void> {
        const medico = await this.repository.findOneBy({ id });

        if (!medico) {
            throw new NotFoundException('Médico no encontrado');
        }

        if (dto.valor_consulta === undefined) {
            throw new BadRequestException(
                'Debe indicar el nuevo valor de la consulta',
            );
        }

        medico.valor_consulta = dto.valor_consulta;

        await this.repository.save(medico);
    }
}
