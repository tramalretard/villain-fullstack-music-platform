import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from 'prisma/generated';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles));
}
