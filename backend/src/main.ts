import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API Clínica - Turnos')
    .setDescription('Reservas, turnos y roles (médico, paciente, administrador)')
=======

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);

  // Habilitar CORS
  app.enableCors();

  // Configurar prefijo global y versionado URI (/api/v1/...)
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Configurar Swagger en /api/docs
  const config = new DocumentBuilder()
    .setTitle('API Gestión de Clínica')
    .setDescription('Documentación de los endpoints del backend')
>>>>>>> 56ed50f15198c335a72487e317d36460c410386e
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

<<<<<<< HEAD
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
=======
  await app.listen(3000);
}
bootstrap();
>>>>>>> 56ed50f15198c335a72487e317d36460c410386e
