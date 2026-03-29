import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Waste } from './entities/waste.entity';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';

@Injectable()
export class WasteService {
  constructor(
    @InjectRepository(Waste)
    private wasteRepository: Repository<Waste>,
  ) { }

  // 1. Crear registro de residuo (Entrada a inventario)
  async create(createWasteDto: CreateWasteDto): Promise<Waste> {
    const newWaste = this.wasteRepository.create(createWasteDto);
    return await this.wasteRepository.save(newWaste);
  }

  // 2. Obtener todo el inventario activo
  async findAll(): Promise<Waste[]> {
    return await this.wasteRepository.find({ where: { isActive: true } });
  }

  // 3. Buscar un residuo específico por ID
  async findOne(id: number): Promise<Waste> {
    const waste = await this.wasteRepository.findOneBy({ id });
    if (!waste) throw new NotFoundException(`El residuo con ID ${id} no existe.`);
    return waste;
  }

  // 4. Actualizar datos de un residuo
  async update(id: number, updateWasteDto: UpdateWasteDto): Promise<Waste> {
    const waste = await this.findOne(id);
    const updatedWaste = Object.assign(waste, updateWasteDto);
    return await this.wasteRepository.save(updatedWaste);
  }

  // 5. "Eliminar" residuo (Baja lógica para auditoría)
  async remove(id: number): Promise<void> {
    const waste = await this.findOne(id);
    waste.isActive = false; // No borramos, solo desactivamos por seguridad legal
    await this.wasteRepository.save(waste);
  }
}