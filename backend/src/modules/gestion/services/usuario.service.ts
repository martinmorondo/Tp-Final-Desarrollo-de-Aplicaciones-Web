import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';
import { CreateUsuarioDto } from '../dtos/input/create-usuario.dto.js';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly repository: Repository<Usuario>,
    ) {}

    async crearUsuario(dto: CreateUsuarioDto): Promise<{ id: number }> {
        const input = dto as any; // Casteo rápido para evitar los subrayados en dto.email y dto.documento

        const existe = await this.repository.findOne({
        where: [{ email: input.email }, { documento: input.documento }],
        });

        if (existe) {
        throw new BadRequestException('El email o documento ya se encuentra registrado');
        }

        const usuario = this.repository.create(input);
        const guardado = await this.repository.save(usuario as any);
        return { id: (guardado as any).id };
    }

    async obtenerPorId(id: number): Promise<Usuario> {
        const usuario = await this.repository.findOneBy({ id });
        if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
        }
        return usuario;
    }

    async obtenerPorRol(rol: RolUsuario): Promise<Usuario[]> {
        return await this.repository.find({
        where: { rol, estado: EstadoUsuario.ACTIVO },
        order: { id: 'ASC' },
        });
    }

    async existeUsuarioActivoPorId(id: number): Promise<boolean> {
        return await this.repository.exists({
        where: { id, estado: EstadoUsuario.ACTIVO },
        });
    }
}