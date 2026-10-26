import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";

import { Reserva } from "../entities/reserva.entity.js";
import { EstadoReserva } from "../enums/estados-reserva.enum.js";
import { CreateReservasDto } from "../dtos/input/create-reservas.dto.js";
import { UpdateReservasDto } from "../dtos/input/update-reservas.dto.js";
import { ListReservasDTO } from "../dtos/output/list-reservas.dto.js";
import { ReservaDTO } from "../dtos/output/reservas.dto.js";
import { ListPacienteDTO } from "../dtos/output/list-paciente.dto.js";

import type { UsuarioService } from "./usuario.service.js";
import type { MedicoService } from "./medico.service.js";

@Injectable()
export class ReservasService {

    constructor(
        @InjectRepository(Reserva)
        private readonly repository: Repository<Reserva>,

        @Inject(forwardRef(() => Symbol.for('UsuarioService')))
        private readonly usuarioService: UsuarioService,

        @Inject(forwardRef(() => Symbol.for('MedicoService')))
        private readonly medicoService: MedicoService,
    ) { }

    async crearReserva(dto: CreateReservasDto): Promise<{ id: number }> {
        const input = dto as any;

        const pacienteActivo = await (this.usuarioService as any).existeUsuarioActivoPorId(input.id_paciente ?? input.idPaciente);
        if (!pacienteActivo) {
        throw new BadRequestException('El paciente especificado no está activo o no existe');
        }

        const medico = await (this.medicoService as any).obtenerPorId(input.id_medico ?? input.idMedico);
        if (!medico) {
        throw new BadRequestException('El médico especificado no existe');
        }

        const reserva = this.repository.create({
        ...input,
        valor_consulta: medico.valor_consulta,
        estado: EstadoReserva.ACTIVO,
        } as any) as any;

        const guardada = await this.repository.save(reserva);
        return { id: guardada.id };
    }

    async actualizarReserva(id: number, dto: UpdateReservasDto): Promise<void> {
        const reserva: Reserva | null = await this.repository.findOne({ where: { id } });

        if (!reserva) {
        throw new BadRequestException('Reserva no encontrada');
        }

        const input = dto as any;
        if (input.id_paciente || input.idPaciente) {
        const usuarioActivo = await (this.usuarioService as any).existeUsuarioActivoPorId(input.id_paciente ?? input.idPaciente);
        if (!usuarioActivo) {
            throw new BadRequestException('Se debe especificar un paciente/usuario activo para la reserva');
        }
        }

        this.repository.merge(reserva, input);
        await this.repository.save(reserva as any);
    }

    async obtenerReservas(): Promise<ListReservasDTO[]> {
        const reservas: Reserva[] = await this.repository.find({
        relations: { paciente: true, medico: true } as any,
        order: { id: 'ASC' },
        });

        const dtoList: ListReservasDTO[] = [];

        for (const r of reservas) {
        const dto = new ListReservasDTO() as any;
        dto.id = r.id;
        dto.estado = r.estado;
        
        if ((r as any).paciente) {
            dto.paciente = new ListPacienteDTO();
            dto.paciente.id = (r as any).paciente.id;
            dto.paciente.nombre = `${(r as any).paciente.nombres ?? ''} ${(r as any).paciente.apellidos ?? ''}`;
        }

        dtoList.push(dto);
        }

        return dtoList;
    }

    async obtenerReserva(id: number): Promise<ReservaDTO> {
        const reserva: Reserva | null = await this.repository.findOne({
        where: { id },
        relations: { paciente: true, medico: true } as any,
        });

        if (!reserva) {
        throw new BadRequestException('Reserva no encontrada');
        }

        const dto = new ReservaDTO() as any;
        dto.id = reserva.id;
        dto.estado = reserva.estado;
        dto.fecha = (reserva as any).fecha_hora;

        return dto;
    }

    async existeReservaPorIdPaciente(idPaciente: number): Promise<boolean> {
        return await this.repository.exists({
        where: {
            id_paciente: idPaciente,
            estado: In([EstadoReserva.ACTIVO]),
        } as any,
        });
    }

    async existeReservaPorIdMedico(idMedico: number): Promise<boolean> {
        return await this.repository.exists({
        where: {
            id_medico: idMedico,
            estado: In([EstadoReserva.ACTIVO]),
        } as any,
        });
    }

    async existeReservaPorIdUsuario(idUsuario: number): Promise<boolean> {
        return await this.repository.exists({
        where: [
            { id_paciente: idUsuario, estado: EstadoReserva.ACTIVO },
            { id_medico: idUsuario, estado: EstadoReserva.ACTIVO },
        ] as any,
        });
    }
}