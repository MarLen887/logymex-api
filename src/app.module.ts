import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importación de nuestros 8 Módulos de LOGYMEX
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WasteModule } from './waste/waste.module';
import { InventoryModule } from './inventory/inventory.module';
import { UnitsModule } from './units/units.module';
import { LogsModule } from './logs/logs.module';
import { FilesModule } from './files/files.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    // 1. Cargar las variables de entorno globales (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Configurar la conexión a PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'), // Leemos la variable del .env
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    // 3. Registrar los módulos del sistema
    AuthModule,
    UsersModule,
    WasteModule,
    InventoryModule,
    UnitsModule,
    LogsModule,
    FilesModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }