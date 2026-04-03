import { UserRole } from 'src/user/entity/user-role.enum';

export interface CurrentUser {
  id: number;
  email: string;
  role: UserRole;
  sub: number;
}
