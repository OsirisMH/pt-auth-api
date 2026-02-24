import type { TokenServicePort } from '../ports/token-service.port';
import type { RefreshTokenRepoPort } from '../ports/refresh-token-repo.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import type { EmployeeRepoPort } from '../ports/employee-repo.port';
import type { EmployeeRolesRepoPort } from '../ports/employee-roles-repo.port';
import type { ClockPort } from '../ports/clock.port';
import {
  RefreshTokenExpiredError,
  RefreshTokenInvalidError,
  UserInactiveError,
} from '../errors/auth.errors';
import { EmployeeStatus } from '../../domain';

type Input = { employeeId: number; refreshToken: string };
type Output = { accessToken: string; refreshToken: string };

export class RefreshUseCase {
  constructor(
    private readonly users: EmployeeRepoPort,
    private readonly roles: EmployeeRolesRepoPort,
    private readonly refreshRepo: RefreshTokenRepoPort,
    private readonly hasher: PasswordHasherPort,
    private readonly tokens: TokenServicePort,
    private readonly clock: ClockPort,
  ) {}

  async execute(input: Input): Promise<Output> {
    const now = this.clock.now();

    const active = await this.refreshRepo.findActiveByEmployeeId(input.employeeId);
    if (!active) throw new RefreshTokenInvalidError();
    if (active.revokedAt) throw new RefreshTokenInvalidError();
    if (active.expiresAt.getTime() <= now.getTime()) throw new RefreshTokenExpiredError();

    const ok = await this.hasher.verify(active.tokenHash, input.refreshToken);
    if (!ok) throw new RefreshTokenInvalidError();

    const user = await this.users.findEmployeeById(input.employeeId);
    if (!user) throw new RefreshTokenInvalidError();
    if (user.statusId !== EmployeeStatus.Active) throw new UserInactiveError();

    const roles = await this.roles.getRolesByEmployeeId(user.id);

    const accessToken = await this.tokens.signAccessToken({
      sub: String(user.id),
      email: user.email,
      roles,
    });

    const newRefresh = await this.tokens.generateRefreshToken();
    const newRefreshHash = await this.hasher.hash(newRefresh);
    const newExpiresAt = this.clock.addDays(now, 7);

    await this.refreshRepo.revokeById(active.id, active.revokedAt!);
    const created = await this.refreshRepo.createForUser({
      employeeId: user.id,
      tokenHash: newRefreshHash,
      expiresAt: newExpiresAt,
    });
    await this.refreshRepo.revokeById(active.id, now, created.id);

    return { accessToken, refreshToken: newRefresh };
  }
}