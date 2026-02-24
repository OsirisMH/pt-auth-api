export type PrimitiveApp = {
  id: number
  key: string
  name: string

  // audit fields
  createdAt?: Date
  deletedAt?: Date
}

export class AppEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly key: string,
    private readonly createdAt?: Date,
    private readonly deletedAt?: Date,
  ) {}

  static create(params: PrimitiveApp): AppEntity {

    return new AppEntity(
      params.id,
      params.name.trim(),
      params.key.trim(),
      params.createdAt ?? new Date(),
      params.deletedAt,
    )
  }

  toValue(): PrimitiveApp {
    return {
      id: this.id,
      name: this.name,
      key: this.key,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
    }
  }
}