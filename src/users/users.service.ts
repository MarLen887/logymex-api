import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    // 1. Verificar si el usuario ya existe en la base de datos
    const userExists = await this.userRepository.findOneBy({ usuario: createUserDto.usuario });
    if (userExists) {
      throw new BadRequestException('Este nombre de usuario ya está registrado.');
    }

    // 2. Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.contrasena, saltRounds);

    // 3. Crear el nuevo usuario reemplazando la contraseña plana por la encriptada
    const newUser = this.userRepository.create({
      ...createUserDto,
      contrasena: hashedPassword,
    });

    // 4. Guardar en PostgreSQL
    const savedUser = await this.userRepository.save(newUser);

    // 5. Extraer la contraseña y devolver el resto de los datos (Técnica TypeScript)
    const { contrasena, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }

  // Función para que el módulo de Auth busque al usuario por su nombre de usuario
  async findOneByUsername(usuario: string) {
    return this.userRepository.findOneBy({ usuario });
  }

}