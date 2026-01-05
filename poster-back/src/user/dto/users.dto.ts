import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../entity/user-role.enum';

export class User {
  @Expose()
  id: number;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Exclude()
  password: string;
  @Exclude()
  role: UserRole;
  @Exclude()
  refreshToken: string[];
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
