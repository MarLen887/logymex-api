import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WasteModule } from './waste/waste.module';
import { UnitsModule } from './units/units.module';
import { LogsModule } from './logs/logs.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    // Carga de variables de entorno (.env)
    ConfigModule.forRoot(),
    // Configuración de la conexión a PostgreSQL para LOGYMEX
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // ¡Solo para desarrollo! Crea tablas automáticamente.
      logging: true,
    }),
    WasteModule,
    UnitsModule,
    LogsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule { }