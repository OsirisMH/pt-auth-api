import type { EmployeeAuthRecord } from "../dtos/employee.dto";

export interface EmployeeRepoPort {
  findEmployeeByEmail(email: string): Promise<EmployeeAuthRecord | null>;
  findEmployeeById(employeeId: number): Promise<EmployeeAuthRecord | null>;
}