import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      //  get the token :-
      const request = context.switchToHttp().getRequest();
      const token = this.extractJWTToken(request);

      if (!token) {
        throw new UnauthorizedException();
      }

      const decodedPayLoad = this.jwtService.verify(token);

      console.log(decodedPayLoad);

      request['user'] = decodedPayLoad;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractJWTToken(req: Request) {
    return req.headers['authorization']?.split(' ')[1];
  }
}
