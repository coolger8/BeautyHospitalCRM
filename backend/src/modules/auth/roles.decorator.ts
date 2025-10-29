import { SetMetadata } from '@nestjs/common';
import { StaffRole } from '../../entities/staff.entity';

export const Roles = (...roles: StaffRole[]) => SetMetadata('roles', roles);