import { isNull } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { departments } from '../schemas/department.schema';
import type { DepartmentRepoPort } from '../../../../../core/application/ports/department-repo.port';
import type { DepartmentOption } from '../../../../../core/application/dtos/department.dto';

export class DrizzleDepartmentRepository implements DepartmentRepoPort {
  constructor(private readonly db: ReturnType<typeof drizzle>) {}

  async getActiveDepartments(): Promise<DepartmentOption[]> {
    const rows = await this.db
      .select({
        id: departments.id,
        name: departments.name,
        description: departments.description
      })
      .from(departments)
      .where(isNull(departments.deletedAt));

    return rows;
  }
}