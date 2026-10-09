import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Usuario } from '../entities/usuario.entity.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';
import { CreateUsuarioDto } from '../dtos/input/create-usuario.dto.js';
import { UpdateUsuarioDto } from '../dtos/input/update-usuario.dto.js';
import { ListUsuarioDTO } from '../dtos/output/list-usuario.dto.js';
import { ReservasService } from './reservas.service.js'; // Importamos la clase directamente

@Injectable()
export class UsuarioService {
    constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,

    @Inject(forwardRef(() => ReservasService))
    private readonly reservasService: ReservasService,
    ) {}

    async crearUsuario(dto: CreateUsuarioDto): Promise<{ id: number }> {
        const usuario = this.repository.create(dto as any);
        const guardado = await this.repository.save(usuario);
        return { id: (guardado as any).id };
    }

    async actualizarUsuario(id: number, dto: UpdateUsuarioDto): Promise<void> {
        // Variable en minúscula para evitar conflicto con la clase
        const usuario: Usuario | null = await this.repository.findOneBy({ id });

        if (!usuario) {
        throw new BadRequestException('Usuario no encontrado');
        }

        const relacionadoConReservas: boolean = await this.reservasService.existeReservaPorIdUsuario(id);

        if (relacionadoConReservas && dto.estado === EstadoUsuario.BAJA) {
        throw new BadRequestException('No se puede dar de baja un usuario con reservas relacionadas');
        }

        this.repository.merge(usuario, dto as any);
        await this.repository.save(usuario);
    }

    async obtenerUsuario(estado?: EstadoUsuario): Promise<ListUsuarioDTO[]> {
    const whereCondition: FindOptionsWhere<Usuario> = {};

    if (estado) {
        (whereCondition as any).estado = estado;
    }

    const usuario: Usuario[] = await this.repository.find({
        where: whereCondition,
        order: { id: 'ASC' },
    });

    const dtoList: ListUsuarioDTO[] = [];

    for (const u of usuario) {
        const dto = new ListUsuarioDTO();
        dto.id = u.id;
        dto.nombre = `${(u as any).nombres ?? ''} ${(u as any).apellidos ?? ''}`;
        dto.estado = (u as any).estado;
        dtoList.push(dto);
    }

        return dtoList;
    }
}