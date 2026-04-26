import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Roles(Role.DIRECTOR_GENERAL, Role.JEFE_LOGISTICA)
  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto, @Request() req) {
    createInventoryDto.usuarioId = req.user.id;
    return this.inventoryService.create(createInventoryDto);
  }

  @Roles(Role.DIRECTOR_GENERAL, Role.JEFE_LOGISTICA)
  @Get('movements')
  findAll() {
    return this.inventoryService.findAll();
  }

  @Roles(Role.DIRECTOR_GENERAL, Role.JEFE_LOGISTICA)
  @Get('stock')
  getStock() {
    return this.inventoryService.getStock();
  }
}