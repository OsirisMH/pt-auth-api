import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { employees } from '../schemas/employee.schema';
import type { EmployeeRepoPort } from '../../../../../core/application/ports/employee-repo.port';
import type { EmployeeAuthRecord } from '../../../../../core/application/dtos/employee.dto';

export class DrizzleEmployeeRepository implements EmployeeRepoPort {
  constructor(private readonly db: ReturnType<typeof drizzle>) {}

  async findEmployeeByEmail(email: string): Promise<EmployeeAuthRecord | null> {
    const rows = await this.db
      .select({
        id: employees.id,
        name: employees.name,
        email: employees.email,
        password: employees.password,
        departmentId: employees.departmentId,
        positionId: employees.positionId,
        statusId: employees.statusId,
      })
      .from(employees)
      .where(eq(employees.email, email))
      .limit(1);

    return rows[0] ?? null;
  }

  async findEmployeeById(userId: number): Promise<EmployeeAuthRecord | null> {
    const rows = await this.db
      .select({
        id: employees.id,
        name: employees.name,
        email: employees.email,
        password: employees.password,
        departmentId: employees.departmentId,
        positionId: employees.positionId,
        statusId: employees.statusId,
      })
      .from(employees)
      .where(eq(employees.id, userId))
      .limit(1);

    return rows[0] ?? null;
  }
}