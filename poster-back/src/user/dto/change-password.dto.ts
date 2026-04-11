import { IsStrongPassword } from 'class-validator';

export class ChangePasswordDTO {
  @IsStrongPassword()
  currentpassword: string;

  @IsStrongPassword()
  newpassword: string;
}
