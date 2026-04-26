import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CONFIGURACIÓN GLOBAL DE CORS
  app.enableCors({
    origin: true, // Permite cualquier origen (útil para desarrollo con Flutter)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // VALIDACIONES AUTOMÁTICAS (Para que no entren datos basura)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(3000);
  console.log(`API de LOGYMEX corriendo en: ${await app.getUrl()}`);
}
bootstrap();