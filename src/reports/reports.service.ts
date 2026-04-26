import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) { }

  async create(createReportDto: CreateReportDto) {
    const newReport = this.reportRepository.create({
      titulo: createReportDto.titulo,
      tipo: createReportDto.tipo,
      descripcion: createReportDto.descripcion,
      generadoPor: { id: createReportDto.generadoPorId },
    });
    return await this.reportRepository.save(newReport);
  }

  async findAll() {
    return await this.reportRepository.find({
      relations: ['generadoPor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['generadoPor'],
    });
    if (!report) {
      throw new NotFoundException(`El reporte con ID ${id} no fue encontrado`);
    }
    return report;
  }

  async remove(id: string) {
    const report = await this.findOne(id);
    return await this.reportRepository.remove(report);
  }
}