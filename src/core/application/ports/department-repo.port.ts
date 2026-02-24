import type { DepartmentOption } from "../dtos/department.dto";

export interface DepartmentRepoPort {
  getActiveDepartments(): Promise<DepartmentOption[]>
}