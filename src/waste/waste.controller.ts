import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WasteService } from './waste.service';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Residuos')
@ApiBearerAuth()
@Controller('waste')
@UseGuards(AuthGuard('jwt'))

export class WasteController {
  constructor(private readonly wasteService: WasteService) { }

  @Post()
  create(@Body() createWasteDto: CreateWasteDto) {
    return this.wasteService.create(createWasteDto);
  }

  @Get()
  findAll() {
    return this.wasteService.findAll();
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
