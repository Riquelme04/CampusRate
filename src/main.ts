import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from './config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ProblemDetailsFilter } from './common/filter/problem-details.filter';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const allowedOrigins = configService
    .get<string>('CORS_ORIGINS', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  app.use(helmet());

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    exposedHeaders: ['Location'],
  });

  // Préfixe global
  app.setGlobalPrefix('api');

  // Versionnement de l'API
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validation globale des DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Gestion uniforme des erreurs
  app.useGlobalFilters(new ProblemDetailsFilter());

  // Documentation Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CampusRate')
    .setDescription('API REST des endroits et appréciations du campus')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(config.port);
}

void bootstrap();
