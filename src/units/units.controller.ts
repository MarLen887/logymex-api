import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ Protegemos todas las rutas
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) { }

  // 👑 Solo Director y Jefe de Logística pueden agregar vehículos nuevos
  @Roles(Role.DIRECTOR_GENERAL, Role.JEFE_LOGISTICA)
  @Post()
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  // 👥 Todos pueden ver los vehículos (Los operadores necesitan verlos para su bitácora)
  @Get()
  findAll() {
    return this.unitsService.findAll();
  }

  // Solo Director y Jefe pueden cambiar el estatus manualmente (ej. Mandarlo a Mantenimiento)
  @Roles(Role.DIRECTOR_GENERAL, Role.JEFE_LOGISTICA)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('estatus') estatus: string) {
    return this.unitsService.updateStatus(id, estatus);
  }

  // Solo Director y Jefe pueden dar de baja un vehículo
  @Roles(Role.DIRECTOR_GENERAL, Role.JEFE_LOGISTICA)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}