import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
import { UserRole } from 'src/user/entity/user-role.enum';

export class CreateUserDTO {
  @IsString()
  @ApiProperty({ description: 'Username' })
  username: string;

  @IsEmail()
  @ApiProperty({ description: 'Email' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Name ' })
  firstName: string;

  @IsString()
  @ApiProperty({ description: 'Lastname' })
  LastName: string;

  @IsStrongPassword()
  @ApiProperty({ description: 'Password' })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Roles should be optional' })
  role: UserRole;
}
