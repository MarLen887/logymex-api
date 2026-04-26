import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Los nombres son obligatorios' })
    nombres: string;

    @IsString()
    @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
    apellidos: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    usuario: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    contrasena: string;

    @IsString()
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    @MaxLength(15)
    telefono: string;

    @IsEnum(Role, { message: 'Rol inválido' })
    @IsOptional()
    rol?: Role;
}