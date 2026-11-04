import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { LoginDTO } from "../dtos/input/login.dto.js";
import { LoginResponseDTO } from "../dtos/output/login-response.dto.js";
import { UsuariosService } from "./usuario.service.js";

@Injectable()
export class AuthService {

    constructor(private readonly usuariosService: UsuariosService,
        private jwtService: JwtService) { }

    async login(dto: LoginDTO): Promise<LoginResponseDTO> {

        const usuario = await this.usuariosService.buscarUsuarioActivoPorEmail(dto.email);

        if (!usuario) {
            throw new UnauthorizedException("Usuario no encontrado");
        }

        if (!(await bcrypt.compare(dto.clave, usuario.clave))) {
            throw new UnauthorizedException();
        }

        const payload = {
            nombre: usuario.nombres,
            sub: usuario.id,
            rol: usuario.rol,
        };

        const respuesta = new LoginResponseDTO();
        respuesta.accessToken = this.jwtService.sign(payload);
        return respuesta;
    }
}