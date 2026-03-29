import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'El formato del correo es incorrecto.' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    password: string;
}