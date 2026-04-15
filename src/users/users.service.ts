import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  // Se actualiza para obtener los nuevos campos y forzar la inclusión del password para el login
  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username: username.trim() },
      select: ['id', 'username', 'password', 'firstName', 'lastName', 'position', 'isActive'],
    });
  }

  // 1. Crear usuario con hashing y validación de username único
  async create(createUserDto: CreateUserDto): Promise<User> { // <-- Se restituye el tipado estricto
    try {
      const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);

      // Construcción explícita del objeto para forzar la inferencia del tipo 'User' singular
      const user = this.usersRepository.create({
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        username: createUserDto.username.trim(),
        position: createUserDto.position,
        password: hashedPassword,
      });

      await this.usersRepository.save(user);

      // Eliminamos el password del objeto que se retorna como respuesta HTTP
      delete (user as any).password;
      return user;

    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException('El nombre de usuario ya está registrado.');
      }
      throw new BadRequestException('Error al crear el usuario.');
    }
  }

  // 2. Obtener todos los usuarios activos
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({ where: { isActive: true } });
  }

  // 3. Buscar un usuario específico por ID
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    return user;
  }

  // 4. Actualizar datos de usuario
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }

    const updatedUser = Object.assign(user, updateUserDto);
    const savedUser = await this.usersRepository.save(updatedUser);
    delete (savedUser as any).password;
    return savedUser;
  }

  // 5. Baja lógica del usuario por seguridad de auditoría
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.usersRepository.save(user);
  }
}