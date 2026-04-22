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
    // CORRECCIÓN DE SEGURIDAD: Evitar devolver unidades dadas de baja
    const unit = await this.unitsRepository.findOne({ where: { id, isActive: true } });
    if (!unit) throw new NotFoundException(`La unidad con ID ${id} no existe o fue dada de baja.`);
    return unit;
  }

  async update(id: number, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const unit = await this.findOne(id);
    // MEJORA: merge fusiona los datos de forma segura para TypeORM
    const updatedUnit = this.unitsRepository.merge(unit, updateUnitDto);
    return await this.unitsRepository.save(updatedUnit);
  }

  async remove(id: number): Promise<void> {
    const unit = await this.findOne(id);
    unit.isActive = false; // Baja lógica para trazabilidad legal
    await this.unitsRepository.save(unit);
  }
}