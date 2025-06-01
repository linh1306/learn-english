import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';
import { ERR } from '../config/err.config';
import { Role } from '@prisma/client';

export const Roles = (...roles: Role[]) => {
  return (
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata('roles', roles, descriptor?.value ?? target);
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const user = req.raw.user;

    console.log('user', req.raw.user);

    if (!user) {
      throw ERR.TOKEN.INVALID;
    }

    if (!roles.includes(user.role)) {
      throw ERR.AUTH.FORBIDDEN;
    }

    return true;
  }
}
