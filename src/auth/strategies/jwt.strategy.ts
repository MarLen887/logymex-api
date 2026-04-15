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
            secretOrKey: configService.get<string>('JWT_SECRET')!,
        });
    }

    // Este método se ejecuta automáticamente si el token es válido

    async validate(payload: any): Promise<User> {
        // Se emplea payload.sub según el estándar JWT, u opcionalmente payload.id
        const userId = payload.sub || payload.id;

        const user = await this.usersService.findOne(userId);

        if (!user) {
            throw new UnauthorizedException('Acceso denegado. El usuario no se encuentra activo.');
        }

        // Al retornar la entidad completa, se subsana la falta de propiedades (ts(2739))
        // NestJS se encargará de inyectar este objeto íntegro en el Request
        return user;
    }
}