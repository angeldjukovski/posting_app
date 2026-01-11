import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/entity/user-role.enum';
import { RolesValidationType } from '../type/roles-validation.type';

export const Role = (
  roles: UserRole[],
  type: RolesValidationType = RolesValidationType.HasSomeOfThese,
) => SetMetadata('rolesConfig', { roles, type });
