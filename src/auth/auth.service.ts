import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService, // Inyección para buscar usuarios
        private readonly jwtService: JwtService,     // Inyección para generar tokens
    ) { }

    async login(loginDto: any) { // Se emplea 'any' temporalmente por si LoginDto aún exige 'email'
        const { username, password } = loginDto;

        // 1. Buscamos al usuario en la base de datos de LOGYMEX por username
        const user = await this.usersService.findOneByUsername(username);

        // Si no existe, lanzamos la excepción y detenemos el proceso
        if (!user) {
            throw new UnauthorizedException('Credenciales no válidas (Usuario).');
        }

        // 2. Comparamos el hash criptográfico
        if (!bcrypt.compareSync(password, user.password!)) {
            throw new UnauthorizedException('Credenciales no válidas (Password).');
        }

        // 3. Generamos el Token de acceso
        const payload = {
            id: user.id,
            username: user.username,
            role: user.position
        };

        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                position: user.position,
            },
            token: this.jwtService.sign(payload),
        };
    }

    // El método de validación debe buscar por 'username'
    async validateUser(username: string, pass: string): Promise<any> {
        // Asegúrese de que en usersService exista el método findOneByUsername
        const user = await this.usersService.findOneByUsername(username);

        if (user && bcrypt.compareSync(pass, user.password!)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}