import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/common/decorators/roleDecorator';
import { UserRole } from 'src/common/entity/userRoleEnum';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const requestObj = context.switchToHttp().getRequest();

      const token = requestObj.headers['authorization']?.split(' ')[1];

      const user = this.jwtService.verify(token);

      if (!user) {
        throw new UnauthorizedException();
      }
      // Check role is allowed or not :-
      const isAllowed = requiredRoles.some((role) => user?.userRole == role);

      if (!isAllowed) {
        throw new UnauthorizedException('User are not allowed to access');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}
