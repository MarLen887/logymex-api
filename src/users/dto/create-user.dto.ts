import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password: string;

    @IsString()
    fullName: string;

    @IsEnum(['admin', 'operator'])
    role: string;
}