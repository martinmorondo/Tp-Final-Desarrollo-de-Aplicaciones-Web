import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Paciente } from '../entities/paciente.entity.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';
import { CreatePacienteDto } from '../dtos/input/create-paciente.dto.js';
import { UpdatePacienteDto } from '../dtos/input/update-paciente.dto.js';
import { ListPacienteDTO } from '../dtos/output/list-paciente.dto.js';
import { ReservasService } from './reservas.service.js'; // Importamos la clase directamente

@Injectable()
export class PacienteService {
    constructor(
    @InjectRepository(Paciente)
    private readonly repository: Repository<Paciente>,

    @Inject(forwardRef(() => ReservasService))
    private readonly reservasService: ReservasService,
    ) {}

    async crearPaciente(dto: CreatePacienteDto): Promise<{ id: number }> {
        const paciente = this.repository.create(dto as any);
        const guardado = await this.repository.save(paciente);
        return { id: (guardado as any).id };
    }

    async actualizarPaciente(id: number, dto: UpdatePacienteDto): Promise<void> {
        // Variable en minúscula para evitar conflicto con la clase
        const paciente: Paciente | null = await this.repository.findOneBy({ id });

        if (!paciente) {
        throw new BadRequestException('Paciente no encontrado');
        }

        const relacionadoConReservas: boolean = await this.reservasService.existeReservaPorIdPaciente(id);

        if (relacionadoConReservas && dto.estado === EstadoUsuario.BAJA) {
        throw new BadRequestException('No se puede dar de baja un paciente con reservas relacionadas');
        }

        this.repository.merge(paciente, dto as any);
        await this.repository.save(paciente);
    }

    async obtenerPaciente(estado?: EstadoUsuario): Promise<ListPacienteDTO[]> {
    const whereCondition: FindOptionsWhere<Paciente> = {};

    if (estado) {
        (whereCondition as any).estado = estado;
    }

    const paciente: Paciente[] = await this.repository.find({
        where: whereCondition,
        order: { id: 'ASC' },
    });

    const dtoList: ListPacienteDTO[] = [];

    for (const p of paciente) {
        const dto = new ListPacienteDTO();
        dto.id = p.id;
        dto.nombre = `${(p as any).nombres ?? ''} ${(p as any).apellidos ?? ''}`;
        dto.estado = (p as any).estado;
        dtoList.push(dto);
    }

        return dtoList;
    }
}