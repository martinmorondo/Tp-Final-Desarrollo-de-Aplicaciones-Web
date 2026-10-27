import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";

import { Reserva } from "../entities/reserva.entity.js";
import { EstadoReserva } from "../enums/estados-reserva.enum.js";
import { EstadoUsuario } from "../enums/estados-usuarios.enum.js";
import { RolUsuario } from "../enums/rol-usuario.enum.js";
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
    const paciente = await this.usuarioService.obtenerPorId(dto.id_paciente);

    if (paciente.estado !== EstadoUsuario.ACTIVO) {
        throw new BadRequestException(
            'El paciente debe estar activo para reservar un turno',
        );
    }

    if (paciente.rol !== RolUsuario.PACIENTE) {
        throw new BadRequestException(
            'El usuario indicado no tiene el rol PACIENTE',
        );
    }

    const medico = await this.medicoService.obtenerPorId(dto.id_medico);

    if (medico.usuario?.estado !== EstadoUsuario.ACTIVO) {
        throw new BadRequestException(
            'El médico debe estar activo para recibir reservas',
        );
    }

    
const fechaTurno = new Date(dto.fecha_hora);

if (Number.isNaN(fechaTurno.getTime())) {
    throw new BadRequestException('La fecha y hora del turno no son válidas');
}

const ahora = new Date();
const limiteAnticipacion = new Date(ahora);
limiteAnticipacion.setDate(limiteAnticipacion.getDate() + 30);

if (fechaTurno <= ahora) {
    throw new BadRequestException('El turno debe ser en una fecha y hora futuras');
}

if (fechaTurno > limiteAnticipacion) {
    throw new BadRequestException(
        'No se pueden reservar turnos con más de 30 días de anticipación',
    );
}

const hora = fechaTurno.getHours();
const minutos = fechaTurno.getMinutes();
const segundos = fechaTurno.getSeconds();

if (
    hora < 8 ||
    hora >= 16 ||
    minutos !== 0 ||
    segundos !== 0 ||
    fechaTurno.getMilliseconds() !== 0
) {
    throw new BadRequestException(
        'Los turnos deben comenzar en horas enteras entre las 08:00 y las 15:00',
    );
}


const finTurno = new Date(fechaTurno);
finTurno.setHours(finTurno.getHours() + 1);

const reservaSuperpuesta = await this.repository
    .createQueryBuilder('reserva')
    .where('reserva.id_medico = :idMedico', {
        idMedico: medico.id,
    })
    .andWhere('reserva.estado = :estado', {
        estado: EstadoReserva.ACTIVO,
    })
    .andWhere('reserva.fecha_hora < :finTurno', {
        finTurno,
    })
    .andWhere(
        "reserva.fecha_hora + INTERVAL '1 hour' > :fechaTurno",
        { fechaTurno },
    )
    .getOne();

if (reservaSuperpuesta) {
    throw new BadRequestException(
        'El médico ya tiene una reserva en ese horario',
    );
}



    const reserva = this.repository.create({
        id_medico: medico.id,
        id_paciente: paciente.id,
        fecha_hora: dto.fecha_hora,
        valor_consulta: medico.valor_consulta,
        estado: EstadoReserva.ACTIVO,
    });

    const guardada = await this.repository.save(reserva);

    return { id: guardada.id };
}


    
async actualizarReserva(
    id: number,
    dto: UpdateReservasDto,
): Promise<void> {
    const reserva = await this.repository.findOne({ where: { id } });

    if (!reserva) {
        throw new BadRequestException('Reserva no encontrada');
    }

    if (reserva.estado === EstadoReserva.CANCELADO) {
        throw new BadRequestException(
            'No se puede modificar una reserva cancelada',
        );
    }

    if (reserva.estado === EstadoReserva.ATENDIDO) {
        throw new BadRequestException(
            'No se puede modificar una reserva que ya fue atendida',
        );
    }

    if (reserva.estado === EstadoReserva.AUSENTE) {
        throw new BadRequestException(
            'No se puede modificar una reserva marcada como ausente',
        );
    }

    reserva.estado = dto.estado;

    await this.repository.save(reserva);
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