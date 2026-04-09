import { IsOptional, IsStrongPassword } from 'class-validator';

export class ResetPasswordDTO {
  @IsStrongPassword()
  newpassword: string;

  @IsOptional()
  token: string;
}
