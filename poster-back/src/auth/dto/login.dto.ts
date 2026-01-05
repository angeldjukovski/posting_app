import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @ApiProperty({ description: 'Email used for login' })
  email: string;

  @IsStrongPassword()
  @ApiProperty({ description: 'Password used for login' })
  password: string;
}
