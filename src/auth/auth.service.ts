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

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // 1. Buscamos al usuario en la base de datos de LOGYMEX
        const user = await this.usersService.findOneByEmail(email);

        // Si no existe, lanzamos la excepción y detenemos el proceso
        if (!user) {
            throw new UnauthorizedException('Credenciales no válidas (Email).');
        }

        // 2. Comparamos el hash. Gracias al IF anterior, TS ya sabe que 'user' no es nulo.
        if (!bcrypt.compareSync(password, user.password!)) { // El '!' confirma que sabemos que existe
            throw new UnauthorizedException('Credenciales no válidas (Password).');
        }

        // 3. Generamos el Token de acceso para el personal
        const payload = { id: user.id, email: user.email, role: user.role };

        return {
            user: {
                id: user.id,
                fullName: user.fullName,
                role: user.role,
            },
            token: this.jwtService.sign(payload),
        };
    }
}