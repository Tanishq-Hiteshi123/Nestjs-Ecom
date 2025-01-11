import { UserRole } from './common/entity/userRoleEnum';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        name: string;
        role: UserRole;
      };
    }
  }
}
