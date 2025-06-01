import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { PayloadJwtDto } from '../types/common/payload-jwt.dto';

export const User = createParamDecorator(
  (data: keyof PayloadJwtDto | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    const payload = req.raw.user as PayloadJwtDto;

    return data ? payload[data] : payload;
  },
);
