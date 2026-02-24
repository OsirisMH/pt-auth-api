import type { RefreshTokenRepoPort } from '../ports/refresh-token-repo.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import type { ClockPort } from '../ports/clock.port';
import { RefreshTokenInvalidError } from '../errors/auth.errors';

export class LogoutUseCase {
  constructor(
    private readonly refreshRepo: RefreshTokenRepoPort,
    private readonly hasher: PasswordHasherPort,
    private readonly clock: ClockPort,
  ) {}

  async execute(input: { employeeId: number; refreshToken: string }): Promise<void> {
    const active = await this.refreshRepo.findActiveByEmployeeId(input.employeeId);
    if (!active || active.revokedAt) throw new RefreshTokenInvalidError();

    const ok = await this.hasher.verify(active.tokenHash, input.refreshToken);
    if (!ok) throw new RefreshTokenInvalidError();

    await this.refreshRepo.revokeById(active.id, this.clock.now());
  }
}