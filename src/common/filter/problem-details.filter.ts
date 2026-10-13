import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Error as MongooseError, mongo } from 'mongoose';

type NestErrorBody = {
  message?: string | string[];
  error?: string;
};

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let messages: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      const body: NestErrorBody =
        typeof exceptionResponse === 'object' && exceptionResponse !== null
          ? exceptionResponse
          : {};

      messages = Array.isArray(body.message)
        ? body.message
        : body.message
          ? [body.message]
          : typeof exceptionResponse === 'string'
            ? [exceptionResponse]
            : [];
    } else if (
      exception instanceof MongooseError.ValidationError ||
      exception instanceof MongooseError.CastError
    ) {
      status = HttpStatus.BAD_REQUEST;
      messages = ['Les données fournies sont invalides.'];
    } else if (
      exception instanceof mongo.MongoServerError &&
      exception.code === 11000
    ) {
      status = HttpStatus.CONFLICT;
      messages = ['Une ressource avec cette valeur unique existe déjà.'];
    } else if (
      exception instanceof mongo.MongoNetworkError ||
      exception instanceof mongo.MongoServerSelectionError ||
      exception instanceof MongooseError.MongooseServerSelectionError
    ) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      messages = ['La base de données est temporairement indisponible.'];
    }

    const title = this.getTitle(status);

    response
      .status(status)
      .type('application/problem+json')
      .json({
        type: 'about:blank',
        title,
        status,
        detail:
          messages[0] ??
          (status === 500 ? 'Une erreur interne est survenue' : title),
        instance: request.originalUrl,
        ...(messages.length > 1 ? { errors: messages } : {}),
      });
  }

  private getTitle(status: number): string {
    const titles: Record<number, string> = {
      400: 'Données invalides',
      404: 'Ressource introuvable',
      409: 'Conflit',
      415: 'Type de média non pris en charge',
      429: 'Trop de requêtes',
      500: 'Erreur interne',
      503: 'Service indisponible',
    };

    return titles[status] ?? 'Erreur HTTP';
  }
}
