
import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Medico } from '../entities/medico.entity.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';
import { CreateMedicoDto } from '../dtos/input/create-medico.dto.js';
import { UpdateMedicoDto } from '../dtos/input/update-medico.dato.js';
import { ListMedicoDTO } from '../dtos/output/list-medico.dto.js';
import { ReservasService } from './reservas.service.js'; // Importamos la clase directamente

@Injectable()
export class MedicoService {
    constructor(
    @InjectRepository(Medico)
    private readonly repository: Repository<Medico>,

    @Inject(forwardRef(() => ReservasService))
    private readonly reservasService: ReservasService,
    ) {}

    async crearMedico(dto: CreateMedicoDto): Promise<{ id: number }> {
        const medico = this.repository.create(dto as any);
        const guardado = await this.repository.save(medico);
        return { id: (guardado as any).id };
    }

    async actualizarMedico(id: number, dto: UpdateMedicoDto): Promise<void> {
        // Variable en minúscula para evitar conflicto con la clase
        const medico: Medico | null = await this.repository.findOneBy({ id });

        if (!medico) {
        throw new BadRequestException('Médico no encontrado');
        }

        const relacionadoConReservas: boolean = await this.reservasService.existeReservaPorIdMedico(id);

        if (relacionadoConReservas && dto.estado === EstadoUsuario.BAJA) {
        throw new BadRequestException('No se puede dar de baja un médico con reservas relacionadas');
        }

        this.repository.merge(medico, dto as any);
        await this.repository.save(medico);
    }

    async obtenerMedico(estado?: EstadoUsuario): Promise<ListMedicoDTO[]> {
    const whereCondition: FindOptionsWhere<Medico> = {};

    if (estado) {
        (whereCondition as any).estado = estado;
    }

    const medico: Medico[] = await this.repository.find({
        where: whereCondition,
        order: { id: 'ASC' },
    });

    const dtoList: ListMedicoDTO[] = [];

    for (const m of medico) {
        const dto = new ListMedicoDTO();
        dto.id = m.id;
        dto.nombre = `${(m as any).nombres ?? ''} ${(m as any).apellidos ?? ''}`;
        dto.estado = (m as any).estado;
        dtoList.push(dto);
    }

        return dtoList;
    }
}