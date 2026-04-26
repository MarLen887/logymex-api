import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Roles(Role.DIRECTOR_GENERAL, Role.JEFE_LOGISTICA)
  @Post()
  create(@Body() createReportDto: CreateReportDto, @Request() req) {
    createReportDto.generadoPorId = req.user.id;
    return this.reportsService.create(createReportDto);
  }

  @Roles(Role.DIRECTOR_GENERAL, Role.JEFE_LOGISTICA)
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Roles(Role.DIRECTOR_GENERAL, Role.JEFE_LOGISTICA)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Roles(Role.DIRECTOR_GENERAL)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}