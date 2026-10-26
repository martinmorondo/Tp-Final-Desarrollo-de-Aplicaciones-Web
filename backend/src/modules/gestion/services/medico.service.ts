import { Injectable, BadRequestException, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Medico } from '../entities/medico.entity.js';
import { CreateMedicoDto } from '../dtos/input/create-medico.dto.js';
import { UpdateMedicoDto } from '../dtos/input/update-medico.dato.js';
import { ListMedicoDTO } from '../dtos/output/list-medico.dto.js';
import { MedicoDTO } from '../dtos/output/medico.dto.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';

import type { ReservasService } from './reservas.service.js';

@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(Medico)
        private readonly repository: Repository<Medico>,

        @Inject(forwardRef(() => Symbol.for('ReservasService')))
        private readonly reservasService: ReservasService,
    ) {}

    async crearMedico(dto: CreateMedicoDto): Promise<{ id: number }> {
        const medico = this.repository.create(dto as any);
        const guardado = await this.repository.save(medico as any);
        return { id: (guardado as any).id };
    }

    async obtenerMedicos(estado?: EstadoUsuario): Promise<ListMedicoDTO[]> {
        const medicos = await this.repository.find({
        relations: { usuario: true } as any,
        order: { id: 'ASC' },
        });

        return medicos.map((m: any) => {
        const dto = new ListMedicoDTO() as any;
        dto.id = m.id;
        dto.matricula = m.matricula;
        dto.valor_consulta = m.valor_consulta;
        if (m.usuario) {
            dto.nombre = `${m.usuario.nombres ?? ''} ${m.usuario.apellidos ?? ''}`;
            dto.estado = m.usuario.estado;
        }
        return dto;
        });
    }

    async obtenerMedico(id: number): Promise<MedicoDTO> {
        const medico = await this.repository.findOne({
        where: { id },
        relations: { usuario: true } as any,
        });

        if (!medico) {
        throw new NotFoundException('Médico no encontrado');
        }

        const dto = new MedicoDTO() as any;
        dto.id = medico.id;
        dto.matricula = medico.matricula;
        dto.valor_consulta = medico.valor_consulta;
        if ((medico as any).usuario) {
        dto.nombre = `${(medico as any).usuario.nombres ?? ''} ${(medico as any).usuario.apellidos ?? ''}`;
        dto.email = (medico as any).usuario.email;
        dto.estado = (medico as any).usuario.estado;
        }

        return dto;
    }

    async obtenerPorId(id: number): Promise<Medico> {
        const medico = await this.repository.findOne({
        where: { id },
        relations: { usuario: true } as any,
        });

        if (!medico) {
        throw new NotFoundException('Médico no encontrado');
        }

        return medico;
    }

    async actualizarMedico(id: number, dto: UpdateMedicoDto): Promise<void> {
        const medico = await this.repository.findOneBy({ id });

        if (!medico) {
        throw new NotFoundException('Médico no encontrado');
        }

        const relacionadoConReservas = await (this.reservasService as any).existeReservaPorIdMedico(id);

        if (relacionadoConReservas && dto.estado === EstadoUsuario.BAJA) {
        throw new BadRequestException('No se puede dar de baja un médico con reservas activas');
        }

        this.repository.merge(medico, dto as any);
        await this.repository.save(medico as any);
    }
}