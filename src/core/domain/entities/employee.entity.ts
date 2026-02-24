import type { EmployeeStatus } from "../value-objects/employee-status"

export type PrimitiveEmployee = {
  id: number
  name: string
  email: string
  password: string
  positionId: number
  departmentId: number
  statusId: EmployeeStatus

  
  // relations
  roles?: string[],

  // audit fields
  createdBy?: number
  createdAt?: Date
  updatedBy?: number
  updatedAt?: Date
  deletedAt?: Date
}

export class EmployeeEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly email: string,
    private readonly password: string,
    private readonly positionId: number,
    private readonly departmentId: number,
    private readonly statusId: EmployeeStatus,
    private readonly roles?: string[],
    private readonly createdBy?: number,
    private readonly createdAt?: Date,
    private readonly updatedBy?: number,
    private readonly updatedAt?: Date,
    private readonly deletedAt?: Date,
  ) {}

  static create(params: PrimitiveEmployee): EmployeeEntity {
    EmployeeEntity.assertEmail(params.email)

    return new EmployeeEntity(
      params.id,
      params.name.trim(),
      params.email.toLowerCase().trim(),
      params.password,
      params.statusId,
      params.positionId,
      params.departmentId,
      params.roles ?? [],
      params.createdBy,
      params.createdAt ?? new Date(),
      params.updatedBy,
      params.updatedAt,
      params.deletedAt,
    )
  }

  toValue(): PrimitiveEmployee {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      positionId: this.positionId,
      departmentId: this.departmentId,
      statusId: this.statusId,
      roles: this.roles ?? [],
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedBy: this.updatedBy,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    }
  }

  private static assertEmail(email: string) {
    if (!email.includes('@')) throw new Error('Invalid email')
  }
}