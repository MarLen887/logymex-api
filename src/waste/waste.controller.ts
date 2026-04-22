import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { WasteService } from './waste.service';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Residuos de Residuos')
@ApiBearerAuth()
@Controller('waste')
@UseGuards(JwtAuthGuard)

export class WasteController {
  constructor(private readonly wasteService: WasteService) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva bitácora de recolección', description: 'Registra el inicio de una ruta y vincula automáticamente al operador autenticado.' })
  @ApiResponse({ status: 201, description: 'Bitácora creada exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado. Token inválido o inexistente.' })

  create(@Body() createWasteDto: CreateWasteDto, @Req() req: any) {
    // El Guardián inyecta el payload del token en req.user
    const userId = req.user.id || req.user.userId || req.user.sub;
    return this.wasteService.create(createWasteDto, userId);
  }

  @Get('export/excel')
  @ApiOperation({ summary: 'Exportar bitácoras a Excel', description: 'Genera un reporte tabular con formato institucional de LOGYMEX.' })
  @ApiResponse({ status: 200, description: 'Archivo .xlsx generado correctamente.' })
  async exportExcel(@Res() res: Response) {
    await this.wasteService.exportToExcel(res);
  }

  @Get('export/pdf')
  @ApiOperation({ summary: 'Exportar bitácoras a PDF', description: 'Genera un documento formal en orientación horizontal para impresión.' })
  @ApiResponse({ status: 200, description: 'Archivo .pdf generado correctamente.' })
  async exportPdf(@Res() res: Response) {
    await this.wasteService.exportToPdf(res);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una bitácora', description: 'Recupera la información completa de un registro específico por ID.' })
  @ApiResponse({ status: 200, description: 'Registro encontrado.' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado o inactivo.' })
  findOne(@Param('id') id: string) {
    return this.wasteService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar bitácora', description: 'Permite añadir la fecha de finalización y cambiar el estado del servicio.' })
  @ApiResponse({ status: 200, description: 'Registro actualizado con éxito.' })
  update(@Param('id') id: string, @Body() updateWasteDto: UpdateWasteDto) {
    return this.wasteService.update(+id, updateWasteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado lógico de bitácora', description: 'Marca el registro como inactivo para preservar la auditoría legal.' })
  @ApiResponse({ status: 200, description: 'Registro desactivado correctamente.' })
  remove(@Param('id') id: string) {
    return this.wasteService.remove(+id);
  }
}

