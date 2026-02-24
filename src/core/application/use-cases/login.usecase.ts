import type { EmployeeRepoPort } from '../ports/employee-repo.port';
import type { EmployeeRolesRepoPort } from '../ports/employee-roles-repo.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import type { TokenServicePort } from '../ports/token-service.port';
import type { RefreshTokenRepoPort } from '../ports/refresh-token-repo.port';
import type { ClockPort } from '../ports/clock.port';
import { InvalidCredentialsError, UserInactiveError } from '../errors/auth.errors';
import { EmployeeStatus } from '../../domain';

type Input = { email: string; password: string };
type Output = {
  accessToken: string;
  refreshToken: string;
  user: { id: number; email: string; roles: string[] };
};

export class LoginUseCase {
  constructor(
    private readonly users: EmployeeRepoPort,
    private readonly roles: EmployeeRolesRepoPort,
    private readonly hasher: PasswordHasherPort,
    private readonly tokens: TokenServicePort,
    private readonly refreshRepo: RefreshTokenRepoPort,
    private readonly clock: ClockPort,
  ) {}

  async execute(input: Input): Promise<Output> {
    const email = input.email.trim().toLowerCase();

    const user = await this.users.findEmployeeByEmail(email);
    if (!user) throw new InvalidCredentialsError();
    if (user.statusId !== EmployeeStatus.Active) throw new UserInactiveError();

    const ok = await this.hasher.verify(user.password, input.password);
    if (!ok) throw new InvalidCredentialsError();

    const roles = await this.roles.getRolesByEmployeeId(user.id);

    const accessToken = await this.tokens.signAccessToken({
      sub: String(user.id),
      email: user.email,
      roles,
    });

    const now = this.clock.now();
    await this.refreshRepo.revokeActiveByUserId(user.id, now);

    const refreshToken = await this.tokens.generateRefreshToken();
    const refreshTokenHash = await this.hasher.hash(refreshToken);
    const expiresAt = this.clock.addDays(now, 7);

    await this.refreshRepo.createForUser({ employeeId: user.id, tokenHash: refreshTokenHash, expiresAt });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, roles },
    };
  }
}