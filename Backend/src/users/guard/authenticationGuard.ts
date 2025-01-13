import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    try {
      // Extract the JWT token
      const token = this.extractJWTToken(request);

      if (!token) {
        throw new UnauthorizedException('Authorization token is missing');
      }

      // Verify and decode the token
      const decodedPayload = this.jwtService.verify(token);

      // Attach user info to the request
      request.user = decodedPayload;

      return true;
    } catch (error) {
      // Specific JWT errors mapped to 401 Unauthorized
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      // Fallback for unknown errors
      // throw new UnauthorizedException('Authentication failed');
      throw error;
    }
  }

  private extractJWTToken(req: Request): string | undefined {
    const authHeader = req.headers['authorization'] || null;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Extract the token after "Bearer"
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token must be provided');
    }

    return token;
  }
}
