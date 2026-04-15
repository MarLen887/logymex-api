//Roles Guard: protege los archivos

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true; // Si la ruta no exige un rol específico, permite el acceso
        }

        const { user } = context.switchToHttp().getRequest();

        // 4. Verificamos si el puesto del usuario coincide con los requeridos
        if (!requiredRoles.includes(user.position)) {
            throw new ForbiddenException('Acceso denegado: Privilegios insuficientes en el organigrama.');
        }
        return true;
    }
}