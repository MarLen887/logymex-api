import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar TypeOrm
import { WasteService } from './waste.service';
import { WasteController } from './waste.controller';
import { Waste } from './entities/waste.entity'; // Importar la Entidad

@Module({
  imports: [TypeOrmModule.forFeature([Waste])], // <-- VINCULACIÓN CRÍTICA
  controllers: [WasteController],
  providers: [WasteService],
})
export class WasteModule { }