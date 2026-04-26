import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Unit } from './entities/unit.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) { }

  async create(createUnitDto: CreateUnitDto) {
    const unitExists = await this.unitRepository.findOneBy({ placas: createUnitDto.placas });
    if (unitExists) {
      throw new BadRequestException(`El vehículo con placas ${createUnitDto.placas} ya está registrado`);
    }

    const newUnit = this.unitRepository.create(createUnitDto);
    return await this.unitRepository.save(newUnit);
  }

  async findAll() {
    return await this.unitRepository.find();
  }

  async updateStatus(id: string, estatus: string) {
    const unit = await this.unitRepository.findOneBy({ id });
    if (!unit) {
      throw new NotFoundException(`La unidad con ID ${id} no existe`);
    }
    unit.estatus = estatus;
    return await this.unitRepository.save(unit);
  }

  async remove(id: string) {
    const unit = await this.unitRepository.findOneBy({ id });
    if (!unit) {
      throw new NotFoundException(`La unidad con ID ${id} no existe`);
    }
    return await this.unitRepository.remove(unit);
  }
}