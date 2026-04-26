import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WasteModule } from './waste/waste.module';
import { InventoryModule } from './inventory/inventory.module';
import { UnitsModule } from './units/units.module';
import { LogsModule } from './logs/logs.module';
import { FilesModule } from './files/files.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [AuthModule, UsersModule, WasteModule, InventoryModule, UnitsModule, LogsModule, FilesModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
