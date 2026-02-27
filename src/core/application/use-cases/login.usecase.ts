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
  user: { id: number; name: string; email: string; roles: string[] };
};

export class LoginUseCase {
  constructor(
    private readonly employees: EmployeeRepoPort,
    private readonly roles: EmployeeRolesRepoPort,
    private readonly hasher: PasswordHasherPort,
    private readonly tokens: TokenServicePort,
    private readonly refreshRepo: RefreshTokenRepoPort,
    private readonly clock: ClockPort,
  ) {}

  async execute(input: Input): Promise<Output> {
    const email = input.email.trim().toLowerCase();

    const employee = await this.employees.findEmployeeByEmail(email);
    if (!employee) throw new InvalidCredentialsError();
    if (employee.statusId !== EmployeeStatus.Active) throw new UserInactiveError();

    const ok = await this.hasher.verify(employee.password, input.password);
    if (!ok) throw new InvalidCredentialsError();

    const roles = await this.roles.getRolesByEmployeeId(employee.id);

    const accessToken = await this.tokens.signAccessToken({
      name: employee.name,
      sub: String(employee.id),
      email: employee.email,
      roles,
    });

    const now = this.clock.now();
    await this.refreshRepo.revokeActiveByEmployeeId(employee.id, now);

    const refreshToken = await this.tokens.generateRefreshToken();
    const refreshTokenHash = await this.hasher.hash(refreshToken);
    const expiresAt = this.clock.addDays(now, 7);

    await this.refreshRepo.createForUser({ employeeId: employee.id, tokenHash: refreshTokenHash, expiresAt });

    return {
      accessToken,
      refreshToken,
      user: { id: employee.id, name: employee.name, email: employee.email, roles },
    };
  }
}