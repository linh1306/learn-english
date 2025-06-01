import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ERR } from '../config/err.config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    if (!req.raw.user) {
      throw ERR.TOKEN.INVALID;
    }

    return true;
  }
}
