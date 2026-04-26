import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WasteService } from './waste.service';
import { WasteController } from './waste.controller';
import { Waste } from './entities/waste.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Waste])], // Conectamos la entidad aquí
  controllers: [WasteController],
  providers: [WasteService],
  exports: [WasteService],
})
export class WasteModule { }