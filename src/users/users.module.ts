import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Registramos la tabla aquí
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Lo exportamos porque el módulo de Auth lo necesitará para el Login
})
export class UsersModule { }