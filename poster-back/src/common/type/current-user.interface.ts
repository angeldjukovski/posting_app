import { UserRole } from 'src/user/entity/user-role.enum';

export interface CurrentUser {
  userId: number;
  email: string;
  role: UserRole;
  sub: number;
}
