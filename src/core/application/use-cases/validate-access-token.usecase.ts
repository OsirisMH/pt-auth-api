import type { TokenServicePort } from '../ports/token-service.port';
import type { EmployeeRepoPort } from '../ports/employee-repo.port';
import type { EmployeeRolesRepoPort } from '../ports/employee-roles-repo.port';
import {
AccessTokenInvalidError,
  UserInactiveError,
} from '../errors/auth.errors';
import { EmployeeStatus } from '../../domain';

type Input = { accessToken: string };
type Output = { id: number; email: string; roles: string[] };

export class ValidateAccessTokenUseCase {
  constructor(
    private readonly employees: EmployeeRepoPort,
    private readonly roles: EmployeeRolesRepoPort,
    private readonly tokens: TokenServicePort,
  ) {}

  async execute(input: Input): Promise<Output> {
    const token = input.accessToken.slice(7).trim(); 
    let payload;

    try {
      payload = await this.tokens.validateAccessToken(token);
    } catch {
      throw new AccessTokenInvalidError();
    }

    const employee = await this.employees.findEmployeeById(Number(payload.sub));
    if (!employee) throw new AccessTokenInvalidError();
    if (employee.statusId !== EmployeeStatus.Active) throw new UserInactiveError();

    const roles = await this.roles.getRolesByEmployeeId(employee.id);

    return { id: employee.id, email: employee.email, roles };
  }
}