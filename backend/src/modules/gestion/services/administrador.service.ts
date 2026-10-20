import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Administrador } from '../entities/administrador.entity.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';
import { CreateAdministradorDto } from '../dtos/input/create-administrador.dto.js';
import { UpdateAdministradorDto } from '../dtos/input/update-administrador.dto.js';
import { ListAdministradorDTO } from '../dtos/output/list-administrador.dto.js';
import { ReservasService } from './reservas.service.js'; // Importamos la clase directamente

@Injectable()
export class AdministradorService {
    constructor(
    @InjectRepository(Administrador)
    private readonly repository: Repository<Administrador>,

    @Inject(forwardRef(() => ReservasService))
    private readonly reservasService: ReservasService,
    ) {}

    async crearAdministrador(dto: CreateAdministradorDto): Promise<{ id: number }> {
        const administrador = this.repository.create(dto as any);
        const guardado = await this.repository.save(administrador);
        return { id: (guardado as any).id };
    }

    async actualizarAdministrador(id: number, dto: UpdateAdministradorDto): Promise<void> {
        // Variable en minúscula para evitar conflicto con la clase
        const administrador: Administrador | null = await this.repository.findOneBy({ id });

        if (!administrador) {
        throw new BadRequestException('Administrador no encontrado');
        }

        const relacionadoConReservas: boolean = await this.reservasService.existeReservaPorIdAdministrador(id);

        if (relacionadoConReservas && dto.estado === EstadoUsuario.BAJA) {
        throw new BadRequestException('No se puede dar de baja un administrador con reservas relacionadas');
        }

        this.repository.merge(administrador, dto as any);
        await this.repository.save(administrador);
    }

    async obtenerAdministrador(estado?: EstadoUsuario): Promise<ListAdministradorDTO[]> {
    const whereCondition: FindOptionsWhere<Administrador> = {};

    if (estado) {
        (whereCondition as any).estado = estado;
    }

    const administrador: Administrador[] = await this.repository.find({
        where: whereCondition,
        order: { id: 'ASC' },
    });

    const dtoList: ListAdministradorDTO[] = [];

    for (const d of administrador) {
        const dto = new ListAdministradorDTO();
        dto.id = d.id;
        dto.nombre = `${(d as any).nombres ?? ''} ${(d as any).apellidos ?? ''}`;
        dto.estado = (d as any).estado;
        dtoList.push(dto);
    }

        return dtoList;
    }
}