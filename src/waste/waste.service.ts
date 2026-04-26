import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWasteDto } from './dto/create-waste.dto';
import { Waste } from './entities/waste.entity';

@Injectable()
export class WasteService {
  constructor(
    @InjectRepository(Waste)
    private readonly wasteRepository: Repository<Waste>,
  ) { }

  async create(createWasteDto: CreateWasteDto) {
    const newWaste = this.wasteRepository.create(createWasteDto);
    return await this.wasteRepository.save(newWaste);
  }

  async findAll() {
    return await this.wasteRepository.find();
  }

  async remove(id: string) {
    const waste = await this.wasteRepository.findOneBy({ id });
    if (!waste) {
      throw new NotFoundException(`El residuo con ID ${id} no existe`);
    }
    return await this.wasteRepository.remove(waste);
  }
}