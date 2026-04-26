import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // Usamos "||" para garantizarle a TypeScript que siempre habrá un string válido
            secretOrKey: configService.get<string>('JWT_SECRET') || 'Logymex_Ambiental_Secret_2026!',
        });
    }

    async validate(payload: any) {
        // NestJS inyectará esto automáticamente en el objeto "request.user"
        return { id: payload.sub, usuario: payload.usuario, rol: payload.rol };
    }
}