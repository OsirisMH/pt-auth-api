import type { AppContext } from './context';

import { DrizzleRefreshTokenRepository } from '../adapters/outbound/db/drizzle/repositories/drizzle-refresh-token.repository';

import { Argon2Hasher } from '../adapters/outbound/security/argon2.hasher';
import { JwtTokenService } from '../adapters/outbound/security/jwt.service';
import { SystemClock } from '../adapters/outbound/security/system.clock';

import { LoginUseCase } from '../core/application/use-cases/login.usecase';
import { RefreshUseCase } from '../core/application/use-cases/refresh.usecase';
import { LogoutUseCase } from '../core/application/use-cases/logout.usecase';
import { AuthController } from '../adapters/inbound/http/controller';
import { ValidateAccessTokenUseCase } from '../core/application/use-cases/validate-access-token.usecase';
import { DrizzleEmployeeRepository } from '../adapters/outbound/db/drizzle/repositories/drizzle-employee.repository';
import { DrizzleEmployeeRolesRepository } from '../adapters/outbound/db/drizzle/repositories/drizzle-employee-roles.repository';
import { GetDepartmentsUseCase } from '../core/application/use-cases/get-departments';
import { DrizzleDepartmentRepository } from '../adapters/outbound/db/drizzle/repositories/drizzle-department.repository';

export const buildAuthModule = (ctx: AppContext) => {
  const employeeRepo = new DrizzleEmployeeRepository(ctx.db);
  const rolesRepo = new DrizzleEmployeeRolesRepository(ctx.db);
  const refreshRepo = new DrizzleRefreshTokenRepository(ctx.db);
  const departmentRepo = new DrizzleDepartmentRepository(ctx.db);

  const hasher = new Argon2Hasher();
  const tokenService = new JwtTokenService(ctx.jwt.privateKeyPem, ctx.jwt.publicKeyPem, ctx.jwt.issuer, ctx.jwt.audience);
  const clock = new SystemClock();

  const login = new LoginUseCase(employeeRepo, rolesRepo, hasher, tokenService, refreshRepo, clock);
  const refresh = new RefreshUseCase(employeeRepo, rolesRepo, refreshRepo, hasher, tokenService, clock);
  const logout = new LogoutUseCase(refreshRepo, hasher, clock);
  const validateAccessToken = new ValidateAccessTokenUseCase(employeeRepo, rolesRepo, tokenService);
  const getDepartments = new GetDepartmentsUseCase(departmentRepo);

  const controller = new AuthController(login, refresh, logout, validateAccessToken, getDepartments);

  return { controller };
};