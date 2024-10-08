import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // console.log('roles', roles);

    if (!roles) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // console.log('guard roles ', roles);

    // console.log('user role', user.roles);
    const guard = roles.some((role) => user.roles.includes(role));
    // console.log('roles guard : ', guard);

    return guard;
  }
}
