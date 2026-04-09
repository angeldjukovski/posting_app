import { IsEmail, IsString, IsOptional } from 'class-validator';

export class VerifyEmailDTO {
  @IsEmail()
  email: string;
}
