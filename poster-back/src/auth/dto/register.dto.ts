import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
import { UserRole } from 'src/user/entity/user-role.enum';

export class RegisterDTO {
  @IsString()
  @ApiProperty({ description: 'Username used for registration' })
  username: string;

  @IsEmail()
  @ApiProperty({ description: 'Email used for registration' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'First Name used for registration' })
  firstName: string;

  @IsString()
  @ApiProperty({ description: 'First Name used for registration' })
  lastName: string;

  @IsStrongPassword()
  @ApiProperty({ description: 'Password used for registration' })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Roles should be optional' })
  role: UserRole;
}
