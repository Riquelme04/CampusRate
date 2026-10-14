import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

import { config } from './config/config';
import { AppModule } from './app.module';
import { ProblemDetailsFilter } from './common/filter/problem-details.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  // Origines CORS selon l'environnement
  const environment = configService.get<string>('NODE_ENV', 'development');

  const originsVariable =
    environment === 'production'
      ? 'CORS_ORIGINS_PRODUCTION'
      : 'CORS_ORIGINS_DEVELOPMENT';

  const allowedOrigins = configService
    .get<string>(originsVariable, '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  app.use(helmet());

  // Journalisation des opérations et des erreurs HTTP
  const httpLogger = new Logger('HTTP');

  app.use((request: Request, response: Response, next: NextFunction) => {
    const isApiRoute =
      request.path === '/api' || request.path.startsWith('/api/');

    if (!isApiRoute) {
      next();
      return;
    }

    const startedAt = performance.now();

    response.once('finish', () => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        method: request.method,
        path: request.path,
        statusCode: response.statusCode,
        duration: `${(performance.now() - startedAt).toFixed(1)} ms`,
      };

      if (response.statusCode < 400) {
        httpLogger.log(logEntry);
      } else {
        httpLogger.error(logEntry);
      }
    });

    next();
  });

  // Méthodes autorisées pour les routes de l'API
  const allowedMethods = ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'];

  app.use((request: Request, response: Response, next: NextFunction) => {
    const isApiRoute =
      request.path === '/api' || request.path.startsWith('/api/');

    if (isApiRoute && !allowedMethods.includes(request.method)) {
      response
        .status(405)
        .setHeader('Allow', allowedMethods.join(', '))
        .type('application/problem+json')
        .json({
          type: 'about:blank',
          title: 'Méthode non autorisée',
          status: 405,
          detail: 'Cette méthode HTTP est interdite pour cette API.',
          instance: request.originalUrl,
        });

      return;
    }

    next();
  });

  app.enableCors({
    origin: allowedOrigins,
    methods: allowedMethods,
    allowedHeaders: ['Content-Type', 'Accept'],
    exposedHeaders: ['Location'],
  });

  // Limite de taille des corps HTTP
  app.useBodyParser('json', { limit: '10kb' });
  app.useBodyParser('urlencoded', { limit: '10kb' });

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
