import type { DepartmentRepoPort } from '../ports/department-repo.port';
import type { DepartmentOption } from '../dtos/department.dto';

export class GetDepartmentsUseCase {
  constructor(
    private readonly departments: DepartmentRepoPort,
  ) {}

  async execute(): Promise<DepartmentOption[]> {
    const data = await this.departments.getActiveDepartments();
    return data;
  }
}