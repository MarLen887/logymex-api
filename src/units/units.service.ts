import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,
  ) { }

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const newUnit = this.unitsRepository.create(createUnitDto);
    return await this.unitsRepository.save(newUnit);
  }

  async findAll(): Promise<Unit[]> {
    return await this.unitsRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<Unit> {
    const unit = await this.unitsRepository.findOneBy({ id });
    if (!unit) throw new NotFoundException(`La unidad con ID ${id} no existe.`);
    return unit;
  }

  async update(id: number, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const unit = await this.findOne(id);
    const updatedUnit = Object.assign(unit, updateUnitDto);
    return await this.unitsRepository.save(updatedUnit);
  }

  async remove(id: number): Promise<void> {
    const unit = await this.findOne(id);
    unit.isActive = false; // Baja lógica para trazabilidad legal
    await this.unitsRepository.save(unit);
  }
}