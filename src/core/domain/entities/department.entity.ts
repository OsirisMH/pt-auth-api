export type PrimitiveDepartment = {
  id: number
  name: string
  description: string

  // audit fields
  createdBy?: number
  createdAt?: Date
  updatedBy?: number
  updatedAt?: Date
  deletedAt?: Date
}

export class DepartmentEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly description: string,
    private readonly createdBy?: number,
    private readonly createdAt?: Date,
    private readonly updatedBy?: number,
    private readonly updatedAt?: Date,
    private readonly deletedAt?: Date,
  ) {}

  static create(params: PrimitiveDepartment): DepartmentEntity {
    return new DepartmentEntity(
      params.id,
      params.name.trim(),
      params.description.trim(),
      params.createdBy,
      params.createdAt ?? new Date(),
      params.updatedBy,
      params.updatedAt,
      params.deletedAt,
    )
  }

  toValue(): PrimitiveDepartment {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedBy: this.updatedBy,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    }
  }
}