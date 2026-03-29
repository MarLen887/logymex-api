import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { Unit } from './entities/unit.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()

@Module({
  imports: [TypeOrmModule.forFeature([Unit])], // Registro de la entidad limpia
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule { }