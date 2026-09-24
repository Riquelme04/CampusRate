import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from './config/config';
import { AppModule } from './app.module';
import { ProblemDetailsFilter } from './common/filter/problem-details.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(config.port);
}

void bootstrap();
