export interface EmployeeRolesRepoPort {
  getRolesByEmployeeId(userId: number): Promise<string[]>;
}