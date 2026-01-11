import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../entity/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserRoleUpdateDTO {
  @IsEnum(UserRole)
  @IsNotEmpty()
  @ApiProperty({ enum: UserRole, example: UserRole.Poster })
  role: UserRole;
}
