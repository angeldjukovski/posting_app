import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user/entity/user-role.enum';
import { RolesValidationType } from '../type/roles-validation.type';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesConfig = this.reflector.getAllAndOverride<{
      roles: UserRole[];
      type: RolesValidationType;
    }>('rolesConfig', [context.getHandler(), context.getClass()]);

    if (!rolesConfig) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      this.logger.error('User not found in request');
      throw new ForbiddenException('User not found');
    }

    if (!user.role) {
      this.logger.error('User Role not found in request');
      throw new ForbiddenException('Role not found');
    }

    if (!Array.isArray(rolesConfig.roles)) {
      throw new ForbiddenException('Roles not Found');
    }

    const hasAccess = rolesConfig?.roles?.includes(user.role);
    console.log('RolesGuard is running');
    console.log('RolesConfig:', rolesConfig);
    console.log('Roles required:', rolesConfig?.roles);
    console.log('User role in request:', user.role);

    if (!hasAccess) {
      this.logger.warn(
        ` Access Denied - User role "${user.role}" is not in ${rolesConfig?.roles}`,
      );
    } else {
      this.logger.log(
        ` Access Granted - User role "${user.role}" matches ${rolesConfig?.roles}`,
      );
    }

    if (!hasAccess) {
      this.logger.warn(
        ` Access Denied - User role "${user.role}" is not in ${rolesConfig.roles}`,
      );
    }

    switch (rolesConfig.type) {
      case RolesValidationType.HasAllOfThese:
        return rolesConfig.roles.every((role) => user.role === role);
      case RolesValidationType.HasSomeOfThese:
        return rolesConfig.roles.some((role) => user.role === role);
      case RolesValidationType.HasNotHaveAllOfThese:
        return !rolesConfig.roles.every((role) => user.role === role);
      case RolesValidationType.HasNotHaveAnyOfThese:
        return !rolesConfig.roles.some((role) => user.role === role);
      default:
        return false;
    }
  }
}
