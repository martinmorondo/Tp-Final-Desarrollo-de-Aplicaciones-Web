
import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../entities/usuario.entity.js';
import { EstadoUsuario } from '../enums/estados-usuarios.enum.js';
import { RolUsuario } from '../enums/rol-usuario.enum.js';
import { CreateUsuarioDto } from '../dtos/input/create-usuario.dto.js';
import { UpdateUsuarioDto } from '../dtos/input/update-usuario.dto.js';
import { ListUsuarioDTO } from '../dtos/output/list-usuario.dto.js';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly repository: Repository<Usuario>,
    ) {}

    async crearUsuario(dto: CreateUsuarioDto): Promise<{ id: number }> {
        const existe = await this.repository.findOne({
            where: [
                { email: dto.email },
                { documento: dto.documento },
            ],
        });

        if (existe) {
            throw new BadRequestException(
                'El email o documento ya se encuentra registrado',
            );
        }

        const claveHash = await bcrypt.hash(dto.clave, 10);

        const usuario = this.repository.create({
            documento: dto.documento,
            apellidos: dto.apellidos,
            nombres: dto.nombres,
            email: dto.email,
            clave: claveHash,
            rol: dto.rol,
            estado: EstadoUsuario.ACTIVO,
        });

        const guardado = await this.repository.save(usuario);

        return { id: guardado.id };
    }

    async obtenerPorId(id: number): Promise<Usuario> {
        const usuario = await this.repository.findOneBy({ id });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }

    async obtenerPorRol(rol: RolUsuario): Promise<Usuario[]> {
        return this.repository.find({
            where: {
                rol,
                estado: EstadoUsuario.ACTIVO,
            },
            order: { id: 'ASC' },
        });
    }

   
async obtenerUsuario(
    estado?: EstadoUsuario,
): Promise<ListUsuarioDTO[]> {
    const usuarios = await this.repository.find({
        where: estado ? { estado } : {},
        order: { id: 'ASC' },
    });

    return usuarios.map((usuario) => ({
        id: usuario.id,
        nombre: `${usuario.nombres} ${usuario.apellidos}`,
        estado: usuario.estado,
    }));
}


    async actualizarUsuario(
        id: number,
        dto: UpdateUsuarioDto,
    ): Promise<void> {
        const usuario = await this.repository.findOneBy({ id });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const datosActualizados = {
            documento: dto.documento,
            apellidos: dto.apellidos,
            nombres: dto.nombres,
            email: dto.email,
            rol: dto.rol,
            estado: dto.estado,
        };

        for (const [campo, valor] of Object.entries(datosActualizados)) {
            if (valor !== undefined) {
                Object.assign(usuario, { [campo]: valor });
            }
        }

        await this.repository.save(usuario);
    }

    async existeUsuarioActivoPorId(id: number): Promise<boolean> {
        return this.repository.exists({
            where: {
                id,
                estado: EstadoUsuario.ACTIVO,
            },
        });
    }
}
