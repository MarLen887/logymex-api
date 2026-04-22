import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Bitácoras')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard) // Aplicamos ambos guardianes de seguridad
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) { }

  // Cualquier usuario logueado (Operadores) puede crear bitácoras
  @Post()
  create(@Body() createLogDto: CreateLogDto, @Req() req: any) {
    // MEJORA DE SEGURIDAD: Extraemos el ID directamente del Token (JWT)
    // Así el operador no puede falsificar quién está haciendo la recolección
    const operatorId = req.user.id || req.user.userId || req.user.sub;
    return this.logsService.create(createLogDto, operatorId);
  }

  // SOLO Jefe y Director pueden ver el listado de bitácoras
  @Roles(Role.JEFE_LOGISTICA, Role.DIRECTOR_GENERAL)
  @Get()
  findAll() {
    return this.logsService.findAll();
  }

  // SOLO Jefe y Director pueden ver una bitácora específica
  @Roles(Role.JEFE_LOGISTICA, Role.DIRECTOR_GENERAL)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(+id);
  }

  // SOLO Jefe y Director pueden modificar
  @Roles(Role.JEFE_LOGISTICA, Role.DIRECTOR_GENERAL)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.logsService.update(+id, updateData);
  }

  // SOLO Jefe y Director pueden borrar (Baja lógica)
  @Roles(Role.JEFE_LOGISTICA, Role.DIRECTOR_GENERAL)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logsService.remove(+id);
  }
}