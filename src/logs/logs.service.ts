import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
  ) { }

  async create(createLogDto: CreateLogDto, operatorId: number): Promise<Log> {
    const newLog = this.logsRepository.create({
      ...createLogDto,
      unit: { id: createLogDto.unitId } as any,
      operator: { id: operatorId } as any,
    });
    return await this.logsRepository.save(newLog);
  }

  async findAll(): Promise<Log[]> {
    return await this.logsRepository.find({
      where: { isActive: true },
      relations: ['unit', 'operator'],
      order: { timestamp: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Log> {
    const log = await this.logsRepository.findOne({
      where: { id, isActive: true },
      relations: ['unit', 'operator']
    });
    if (!log) throw new NotFoundException(`La bitácora con ID ${id} no existe o fue desactivada.`);
    return log;
  }

  async update(id: number, updateData: any): Promise<Log> {
    const log = await this.findOne(id);
    const updatedLog = this.logsRepository.merge(log, updateData);
    return await this.logsRepository.save(updatedLog);
  }

  async remove(id: number): Promise<Log> {
    const log = await this.findOne(id);
    log.isActive = false; // Borrado lógico para cumplir con auditorías
    return await this.logsRepository.save(log);
  }
}