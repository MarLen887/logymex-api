import { Module } from '@nestjs/common'; // Module
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service'; // servicio
import { UsersController } from './users.controller'; // controlador
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }