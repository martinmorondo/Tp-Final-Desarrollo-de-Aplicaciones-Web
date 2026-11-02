
import { Body, Controller, Post } from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { LoginDTO } from "../dtos/input/login.dto.js";
import { AuthService } from "../services/auth.service.js";
import { LoginResponseDTO } from "../dtos/output/login-response.dto.js";

/**
 * Controlador encargado de gestionar la autenticación de usuarios.
 */
@ApiTags("Autenticación")
@Controller("/auth")
export class LoginController {

    constructor(private readonly service: AuthService) { }

    /**
     * Autentica a un usuario mediante sus credenciales.
     *
     * @param dto Datos de acceso del usuario.
     * @returns Token JWT para las solicitudes autenticadas.
     */
    @Post()
    @ApiOperation({
        summary: "Iniciar sesión",
        description: "Valida las credenciales y devuelve un token JWT si el usuario está activo."
    })
    @ApiBody({ type: LoginDTO })
        @ApiCreatedResponse({
        description: "Inicio de sesión exitoso. Devuelve el token de acceso.",
        type: LoginResponseDTO,
    })
    @ApiUnauthorizedResponse({
        description: "Credenciales incorrectas o usuario inactivo."
    })
    @ApiBadRequestResponse({
        description: "Los datos enviados no cumplen las validaciones."
    })
        async login(@Body() dto: LoginDTO): Promise<LoginResponseDTO> {
        return await this.service.login(dto);
    }

}
