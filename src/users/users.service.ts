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

  // 1. Crear usuario con hashing y validación de correo único
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, email, ...userData } = createUserDto;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = this.usersRepository.create({
        ...userData,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      await this.usersRepository.save(user);
      delete (user as any).password; // Casting a any para evitar error de TS
      return user;
    } catch (error) {
      if (error.code === '23505') throw new BadRequestException('El correo ya está registrado.');
      throw new BadRequestException('Error al crear el usuario.');
    }
  }

  // 2. Obtener todos los usuarios activos (Administradores y Operadores)
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({ where: { isActive: true } });
  }

  // 3. Buscar un usuario específico por ID
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    return user;
  }

  // 4. Actualizar datos de usuario (incluyendo re-hasheo de password si cambia)
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
  // Este método es exclusivo para el proceso de Login en LOGYMEX
  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
      select: ['id', 'email', 'password', 'fullName', 'role'], // Forzamos la selección del password cifrado
    });
  }
}