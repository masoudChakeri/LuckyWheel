import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '@app/common';

export const Roles = (...roles: UserRoles[]) => SetMetadata('role', roles); 