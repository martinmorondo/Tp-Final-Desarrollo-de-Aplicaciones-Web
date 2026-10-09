import { LoginDTO } from "../dtos/input/login.dto.js";
export declare class LoginController {
    constructor();
    login(dto: LoginDTO): Promise<{
        accessToken: string;
    }>;
}
