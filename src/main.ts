import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // Importación de Swagger
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configuración de Validaciones Globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // 2. Configuración de Swagger para LOGYMEX Ambiental
  const config = new DocumentBuilder()
    .setTitle('LOGYMEX Ambiental API')
    .setDescription('Sistema de Gestión de Residuos Peligrosos y Bitácoras de Recolección')
    .setVersion('1.0')
    .addBearerAuth() // Permitir pruebas con Token en la interfaz
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Ruta para visualizar la documentación

  await app.listen(3000);
  console.log(`Servidor corriendo en: http://localhost:3000`);
  console.log(`Documentación en: http://localhost:3000/api/docs`);
}
bootstrap();