import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { WasteService } from './waste.service';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('Residuos')
@ApiBearerAuth()
@Controller('waste')
@UseGuards(AuthGuard('jwt'))

export class WasteController {
  constructor(private readonly wasteService: WasteService) { }

  @Post()
  create(@Body() createWasteDto: CreateWasteDto, @Req() req: any) {
    // El Guardián inyecta el payload del token en req.user
    // Extraemos el ID dinámicamente (dependiendo de cómo haya configurado su JwtStrategy)
    const userId = req.user.id || req.user.userId || req.user.sub;

    return this.wasteService.create(createWasteDto, userId);
  }

  @Get('export/excel')
  async exportExcel(@Res() res: Response) {
    await this.wasteService.exportToExcel(res);
  }

  @Get('export/pdf')
  async exportPdf(@Res() res: Response) {
    await this.wasteService.exportToPdf(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wasteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWasteDto: UpdateWasteDto) {
    return this.wasteService.update(+id, updateWasteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wasteService.remove(+id);
  }
}
