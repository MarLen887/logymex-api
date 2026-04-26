import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto) {
    // 1. Buscar al empleado por su usuario
    const user = await this.usersService.findOneByUsername(loginDto.usuario);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Verificar que no lo hayan dado de baja de LOGYMEX
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo. Contacte a su administrador.');
    }

    // 3. Comparar la contraseña que escribió con la encriptada en PostgreSQL
    const isPasswordValid = await bcrypt.compare(loginDto.contrasena, user.contrasena);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 4. Generar el Token JWT (El gafete de acceso válido por 12 horas)
    const payload = { sub: user.id, usuario: user.usuario, rol: user.rol };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        nombres: user.nombres,
        apellidos: user.apellidos,
        rol: user.rol
      }
    };
  }
}