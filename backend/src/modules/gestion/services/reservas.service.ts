import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';

import { Reserva } from "../entities/reserva.entity.js";
import { EstadoReserva } from "../enums/estados-reserva.enum.js";
import { EstadoUsuario } from "../enums/estados-usuarios.enum.js";
import { RolUsuario } from "../enums/rol-usuario.enum.js";
import { CreateReservasDto } from "../dtos/input/create-reservas.dto.js";
import { UpdateReservasDto } from "../dtos/input/update-reservas.dto.js";
import { ListReservasDTO } from "../dtos/output/list-reservas.dto.js";
import { ReservaDTO } from "../dtos/output/reservas.dto.js";
import { ListPacienteDTO } from "../dtos/output/list-paciente.dto.js";

import { UsuarioService } from './usuario.service.js';
import { MedicoService } from './medico.service.js';

@Injectable()
export class ReservasService {

    constructor(
        @InjectRepository(Reserva)
        private readonly repository: Repository<Reserva>,

       private readonly usuarioService: UsuarioService,

        private readonly medicoService: MedicoService,
    ) { }


async crearReserva(
    dto: CreateReservasDto,
    idUsuario: number,
    rol: RolUsuario,
): Promise<{ id: number }> {
    let idPaciente: number;

    if (rol === RolUsuario.PACIENTE) {
        // El paciente siempre reserva para sí mismo.
        // No confiamos en el id_paciente enviado desde el cliente.
        idPaciente = idUsuario;
    } else if (rol === RolUsuario.ADMINISTRADOR) {
        // El administrador debe indicar para qué paciente reserva.
        if (dto.id_paciente === undefined) {
            throw new BadRequestException(
                'Debe indicar el paciente para quien se realiza la reserva',
            );
        }

        idPaciente = dto.id_paciente;
    } else {
        throw new ForbiddenException(
            'No tenés permisos para crear reservas',
        );
    }

    const paciente = await this.usuarioService.obtenerPorId(idPaciente);

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
        throw new BadRequestException(
            'La fecha y hora del turno no son válidas',
        );
    }

    const ahora = new Date();
    const limiteAnticipacion = new Date(ahora);
    limiteAnticipacion.setDate(limiteAnticipacion.getDate() + 30);

    if (fechaTurno <= ahora) {
        throw new BadRequestException(
            'El turno debe ser en una fecha y hora futuras',
        );
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
        fecha_hora: fechaTurno,
        valor_consulta: medico.valor_consulta,
        estado: EstadoReserva.ACTIVO,
    });

    const guardada = await this.repository.save(reserva);

    return { id: guardada.id };
}


async actualizarReserva(
    id: number,
    dto: UpdateReservasDto,
    idUsuario: number,
    rol: RolUsuario,
): Promise<void> {
    const reserva = await this.repository.findOne({
        where: { id },
        relations: {
            medico: {
            usuario: true,
    },
},
    });

    if (!reserva) {
    throw new NotFoundException('Reserva no encontrada');
}

    if (reserva.estado !== EstadoReserva.ACTIVO) {
        throw new BadRequestException(
            'Solo se pueden modificar reservas activas',
        );
    }

    const ahora = new Date();
    const fechaTurno = reserva.fecha_hora;

    if (rol === RolUsuario.PACIENTE) {
        if (reserva.id_paciente !== idUsuario) {
            throw new ForbiddenException(
                'No tenés permisos para modificar esta reserva',
            );
        }

        if (dto.estado !== EstadoReserva.CANCELADO) {
            throw new ForbiddenException(
                'Los pacientes solo pueden cancelar sus reservas',
            );
        }

        const inicioDelDiaDelTurno = new Date(fechaTurno);
        inicioDelDiaDelTurno.setHours(0, 0, 0, 0);

        const inicioDeHoy = new Date(ahora);
        inicioDeHoy.setHours(0, 0, 0, 0);

        if (inicioDelDiaDelTurno <= inicioDeHoy) {
            throw new BadRequestException(
                'Solo podés cancelar hasta el día anterior al turno',
            );
        }
    } else if (rol === RolUsuario.MEDICO) {
        if (reserva.medico?.id_usuario !== idUsuario) {
            throw new ForbiddenException(
                'No tenés permisos para modificar este turno',
            );
        }

        if (
            dto.estado !== EstadoReserva.ATENDIDO &&
            dto.estado !== EstadoReserva.AUSENTE
        ) {
            throw new ForbiddenException(
                'Los médicos solo pueden marcar turnos como atendidos o ausentes',
            );
        }

        if (fechaTurno > ahora) {
            throw new BadRequestException(
                'No podés registrar el resultado de un turno que todavía no comenzó',
            );
        }
    } else if (rol === RolUsuario.ADMINISTRADOR) {
        if (dto.estado !== EstadoReserva.CANCELADO) {
            throw new ForbiddenException(
                'El administrador solo puede cambiar el estado de un turno mediante esta operación para cancelarlo',
            );
        }

        if (fechaTurno <= ahora) {
            throw new BadRequestException(
                'El administrador solo puede cancelar hasta el inicio de la consulta',
            );
        }
    } else {
        throw new ForbiddenException(
            'No tenés permisos para modificar reservas',
        );
    }

    reserva.estado = dto.estado;
    await this.repository.save(reserva);
}

    
async obtenerReservas(): Promise<ListReservasDTO[]> {
    const reservas = await this.repository.find({
        relations: {
            paciente: true,
            medico: {
                usuario: true,
            },
        },
        order: {
            fecha_hora: 'ASC',
        },
    });

    return reservas.map((reserva) => {
        const dto = new ListReservasDTO();

        dto.id = reserva.id;
        dto.fecha_hora = reserva.fecha_hora;
        dto.estado = reserva.estado;
        dto.valor_consulta = reserva.valor_consulta;

        dto.medico = reserva.medico?.usuario
            ? `${reserva.medico.usuario.nombres} ${reserva.medico.usuario.apellidos}`
            : 'Médico no disponible';

        dto.paciente = new ListPacienteDTO();
        dto.paciente.id = reserva.paciente.id;
        dto.paciente.nombre =
            `${reserva.paciente.nombres} ${reserva.paciente.apellidos}`;

        return dto;
    });
}



async obtenerReservasPorPaciente(
    idPaciente: number,
): Promise<ListReservasDTO[]> {
    const reservas = await this.repository.find({
        where: {
            id_paciente: idPaciente,
        },
        relations: {
            paciente: true,
            medico: {
                usuario: true,
            },
        },
        order: {
            fecha_hora: 'ASC',
        },
    });

    return reservas.map((reserva) => {
        const dto = new ListReservasDTO();

        dto.id = reserva.id;
        dto.fecha_hora = reserva.fecha_hora;
        dto.estado = reserva.estado;
        dto.valor_consulta = reserva.valor_consulta;

        dto.medico = reserva.medico?.usuario
            ? `${reserva.medico.usuario.nombres} ${reserva.medico.usuario.apellidos}`
            : 'Médico no disponible';

        dto.paciente = new ListPacienteDTO();
        dto.paciente.id = reserva.paciente.id;
        dto.paciente.nombre =
            `${reserva.paciente.nombres} ${reserva.paciente.apellidos}`;

        return dto;
    });
}


async obtenerReservasPorMedicoYFecha(
    idUsuario: number,
    fecha: string,
): Promise<ListReservasDTO[]> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        throw new BadRequestException(
            'La fecha debe tener el formato YYYY-MM-DD',
        );
    }

    const [anio, mes, dia] = fecha.split('-').map(Number);
    const fechaValidada = new Date(anio, mes - 1, dia);

    if (
        fechaValidada.getFullYear() !== anio ||
        fechaValidada.getMonth() !== mes - 1 ||
        fechaValidada.getDate() !== dia
    ) {
        throw new BadRequestException('La fecha ingresada no es válida');
    }

    const medico = await this.medicoService.obtenerPorUsuario(idUsuario);

    const inicioDia = new Date(anio, mes - 1, dia, 0, 0, 0, 0);
    const finDia = new Date(anio, mes - 1, dia + 1, 0, 0, 0, 0);

    const reservas = await this.repository
        .createQueryBuilder('reserva')
        .leftJoinAndSelect('reserva.paciente', 'paciente')
        .leftJoinAndSelect('reserva.medico', 'medico')
        .leftJoinAndSelect('medico.usuario', 'usuarioMedico')
        .where('reserva.id_medico = :idMedico', {
            idMedico: medico.id,
        })
        .andWhere('reserva.fecha_hora >= :inicioDia', { inicioDia })
        .andWhere('reserva.fecha_hora < :finDia', { finDia })
        .orderBy('reserva.fecha_hora', 'ASC')
        .getMany();

    return reservas.map((reserva) => {
        const dto = new ListReservasDTO();

        dto.id = reserva.id;
        dto.fecha_hora = reserva.fecha_hora;
        dto.estado = reserva.estado;
        dto.valor_consulta = reserva.valor_consulta;

        dto.medico = reserva.medico?.usuario
            ? `${reserva.medico.usuario.nombres} ${reserva.medico.usuario.apellidos}`
            : 'Médico no disponible';

        dto.paciente = new ListPacienteDTO();
        dto.paciente.id = reserva.paciente.id;
        dto.paciente.nombre =
            `${reserva.paciente.nombres} ${reserva.paciente.apellidos}`;

        return dto;
    });
}

   async obtenerReserva(
    id: number,
    idUsuario: number,
    rol: RolUsuario,
): Promise<ReservaDTO> {
    const reserva = await this.repository.findOne({
        where: { id },
        relations: {
            paciente: true,
            medico: {
                usuario: true,
            },
        },
    });

    if (!reserva) {
        throw new NotFoundException('Reserva no encontrada');
    }

    if (
        rol === RolUsuario.PACIENTE &&
        reserva.id_paciente !== idUsuario
    ) {
        throw new ForbiddenException(
            'No tenés permiso para consultar esta reserva',
        );
    }

    if (
        rol !== RolUsuario.PACIENTE &&
        rol !== RolUsuario.ADMINISTRADOR
    ) {
        throw new ForbiddenException(
            'No tenés permiso para consultar esta reserva',
        );
    }

    const dto = new ReservaDTO();

    dto.id = reserva.id;
    dto.fecha_hora = reserva.fecha_hora;
    dto.estado = reserva.estado;
    dto.valor_consulta = reserva.valor_consulta;

    dto.medico = reserva.medico?.usuario
        ? `${reserva.medico.usuario.nombres} ${reserva.medico.usuario.apellidos}`
        : 'Médico no disponible';

    dto.paciente = new ListPacienteDTO();
    dto.paciente.id = reserva.paciente.id;
    dto.paciente.nombre =
        `${reserva.paciente.nombres} ${reserva.paciente.apellidos}`;

    return dto;
}


   async existeReservaPorIdPaciente(idPaciente: number): Promise<boolean> {
    return this.repository.exists({
        where: {
            id_paciente: idPaciente,
            estado: EstadoReserva.ACTIVO,
        },
    });
}

async existeReservaPorIdMedico(idMedico: number): Promise<boolean> {
    return this.repository.exists({
        where: {
            id_medico: idMedico,
            estado: EstadoReserva.ACTIVO,
        },
    });
}
}