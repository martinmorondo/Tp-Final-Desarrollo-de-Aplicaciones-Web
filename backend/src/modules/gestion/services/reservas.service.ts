import { InjectRepository } from "@nestjs/typeorm";
import { CreateReservasDto } from "../dtos/input/create-reservas.dto.js";
import { Reserva } from "../entities/reserva.entity.js";
import { Repository, In } from "typeorm";
import { EstadoReserva } from "../enums/estados-reserva.enum.js";
import { UpdateReservasDto } from "../dtos/input/update-reservas.dto.js";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { ListReservasDTO } from "../dtos/output/list-reservas.dto.js";
import { ReservaDTO } from "../dtos/output/reservas.dto.js";
import { ListPacienteDTO } from "../dtos/output/list-paciente.dto.js";
import { UsuarioService } from "./usuario.service.js";

@Injectable()
export class ReservasService {

    constructor(
        @InjectRepository(Reserva)
        private readonly repository: Repository<Reserva>,

        @Inject(forwardRef(() => UsuarioService))
        private readonly usuarioService: UsuarioService,
    ) { }

    async crearReserva(dto: CreateReservasDto): Promise<{ id: number }> {
        const reserva: Reserva = this.repository.create(dto as any) as any;
        reserva.estado = EstadoReserva.ACTIVO;

        // Verificamos si el paciente/usuario existe y está activo
        const usuarioActivo: boolean = await (this.usuarioService as any).existeUsuarioActivoPorId((dto as any).idPaciente);

        if (!usuarioActivo) {
        throw new BadRequestException('Se debe especificar un paciente/usuario activo para la reserva');
        }

        const guardada = await this.repository.save(reserva as any);
        return { id: (guardada as any).id };
    }

    async actualizarReserva(id: number, dto: UpdateReservasDto): Promise<void> {
        const reserva: Reserva | null = await this.repository.findOne({ where: { id } });

        if (!reserva) {
        throw new BadRequestException('Reserva no encontrada');
        }

        if ((dto as any).idPaciente) {
        const usuarioActivo: boolean = await (this.usuarioService as any).existeUsuarioActivoPorId((dto as any).idPaciente);
        if (!usuarioActivo) {
            throw new BadRequestException('Se debe especificar un paciente/usuario activo para la reserva');
        }
        }

        this.repository.merge(reserva, dto as any);
        await this.repository.save(reserva as any);
    }

    async obtenerReservas(): Promise<ListReservasDTO[]> {
        const reservas: Reserva[] = await this.repository.find({
        relations: { paciente: true, medico: true },
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
        relations: { paciente: true, medico: true },
        });

        if (!reserva) {
        throw new BadRequestException('Reserva no encontrada');
        }

        // Casteamos dto a 'any' para evitar desfasajes con las propiedades de ReservaDTO
        const dto = new ReservaDTO() as any;
        dto.id = reserva.id;
        dto.estado = reserva.estado;
        dto.fecha = (reserva as any).fecha_hora;

        return dto;
    }

    // Métodos auxiliares de verificación para los otros servicios
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

    // Alias por si AdministradorService lo invoca con este nombre
    async existeReservaPorIdAdministrador(idAdmin: number): Promise<boolean> {
        return await this.existeReservaPorIdUsuario(idAdmin);
    }
}