import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class ContentTypeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.method !== 'POST' && request.method !== 'PATCH') {
      return true;
    }

    const contentType = request
      .get('Content-Type')
      ?.split(';')[0]
      .trim()
      .toLowerCase();

    if (contentType !== 'application/json') {
      throw new UnsupportedMediaTypeException(
        'Le Content-Type doit être application/json.',
      );
    }

    return true;
  }
}
