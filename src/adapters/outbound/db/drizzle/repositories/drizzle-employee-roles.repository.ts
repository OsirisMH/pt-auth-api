import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { EmployeeRolesRepoPort } from '../../../../../core/application/ports/employee-roles-repo.port';
import { employeeRoles } from '../schemas/employee-roles.schema';

export class DrizzleEmployeeRolesRepository implements EmployeeRolesRepoPort {
  constructor(private readonly db: ReturnType<typeof drizzle>) {}

  async getRolesByEmployeeId(employeeId: number): Promise<string[]> {
    const rows = await this.db
      .select({ role: employeeRoles.role })
      .from(employeeRoles)
      .where(eq(employeeRoles.employeeId, employeeId));

    return rows.map(r => r.role);
  }
}