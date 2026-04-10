import { IsStrongPassword } from 'class-validator';

export class ChangePasswordDTO {
  @IsStrongPassword()
  newpassword: string;
}
