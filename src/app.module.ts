import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';

import { ContentTypeGuard } from './common/guards/content-type.guard';
import databaseConfig from './config/database.config';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().integer().min(1).max(65535).required(),

        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),

        CORS_ORIGINS_DEVELOPMENT: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),

        CORS_ORIGINS_PRODUCTION: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        autoIndex: process.env.NODE_ENV !== 'production',
      }),
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 10,
      },
    ]),

    PlacesModule,
    ReviewsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ContentTypeGuard,
    },
  ],
})
export class AppModule {}
