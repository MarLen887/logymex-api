import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { WasteService } from './waste.service';
import { CreateWasteDto } from './dto/create-waste.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard) // Exigimos Token JWT en todas las rutas
@Controller('waste')
export class WasteController {
  constructor(private readonly wasteService: WasteService) { }

  // Solo el Director y Jefe de Logística pueden crear residuos
  @Roles(Role.DIRECTOR_GENERAL, Role.JEFE_LOGISTICA)
  @Post()
  create(@Body() createWasteDto: CreateWasteDto) {
    return this.wasteService.create(createWasteDto);
  }

  // 👥 Todos (Operadores, Jefes y Directores) pueden ver el catálogo
  @Get()
  findAll() {
    return this.wasteService.findAll();
  }

  // Solo el Director y Jefe de Logística pueden borrar
  @Roles(Role.DIRECTOR_GENERAL, Role.JEFE_LOGISTICA)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wasteService.remove(id);
  }
}