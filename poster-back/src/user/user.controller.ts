import {
  Controller,
  Body,
  Post,
  Get,
  Patch,
  Delete,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './dto/users.dto';
import { UserRole } from './entity/user-role.enum';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles-guard';
import { UserRoleUpdateDTO } from './dto/update-user.dto.role';
import { Role } from 'src/common/decorator/role.decorator';
import { RolesValidationType } from 'src/common/type/roles-validation.type';
import { GetUser } from 'src/common/decorator/current-user.decorator';
import type { CurrentUser } from 'src/common/type/current-user.interface';
import { plainToInstance } from 'class-transformer';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Role([UserRole.Admin], RolesValidationType.HasAllOfThese)
  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }
  @Role([UserRole.Poster, UserRole.Admin], RolesValidationType.HasSomeOfThese)
  @Get('/profile/')
  async findMe(@GetUser() user: CurrentUser): Promise<User> {
    const userFind = await this.userService.getUserByEmail(user.email);
    return plainToInstance(User, userFind);
  }

  @Role([UserRole.Admin], RolesValidationType.HasAllOfThese)
  @Get('/user-lists')
  findAll() {
    return this.userService.getAll();
  }

  @Role([UserRole.Admin], RolesValidationType.HasAllOfThese)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) userID: number) {
    return this.userService.getUserById(userID);
  }

  @Role([UserRole.Admin, UserRole.Poster], RolesValidationType.HasSomeOfThese)
  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) userID: number,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.userService.updateUser(userID, updateUserDto);
  }

  @Role([UserRole.Admin], RolesValidationType.HasAllOfThese)
  @Patch(':id/role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UserRoleUpdateDTO,
  ) {
    return this.userService.updateUserRole(id, updateUserRoleDto.role);
  }

  @Role([UserRole.Admin, UserRole.Poster], RolesValidationType.HasSomeOfThese)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) userID: number) {
    return this.userService.deleteUser(userID);
  }
}
