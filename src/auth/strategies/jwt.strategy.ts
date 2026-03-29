import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService, // Añadimos private readonly aquí
    ) {
        super({
            // 1. Extraemos el token del header Authorization: Bearer <token>
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // 2. Forzamos que el secreto sea tratado como string para evitar el error de tipado
            secretOrKey: configService.get<string>('JWT_SECRET') || 'fallbackSecret',
        });
    }

    // Este método se ejecuta automáticamente si el token es válido
    async validate(payload: { id: number }): Promise<User> {
        const { id } = payload;

        // Buscamos al usuario en la BD de LOGYMEX para asegurar que no ha sido borrado o desactivado
        const user = await this.usersService.findOne(id);

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Token no válido o usuario inactivo.');
        }

        return user; // NestJS inyecta este usuario en el objeto Request (req.user)
    }
}