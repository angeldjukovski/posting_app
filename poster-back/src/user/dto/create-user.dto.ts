import { IsEmail, IsString, IsEnum, IsStrongPassword } from 'class-validator';
import { UserRole } from '../entity/user-role.enum';

export class CreateUserDTO {
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsStrongPassword()
  password: string;
  @IsEnum(UserRole)
  role: UserRole = UserRole.Poster;
}
