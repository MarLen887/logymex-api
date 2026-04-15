import { IsString, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { Role } from '../../auth/enums/role.enum'; // Verifica que esta ruta apunte correctamente a tu Enum

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
    lastName: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    username: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsEnum(Role, { message: 'El puesto ingresado no es válido dentro del organigrama' })
    @IsNotEmpty()
    position: Role;
}