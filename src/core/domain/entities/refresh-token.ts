export type PrimitiveRefreshToken = {
  id: number
  userId: number
  tokenHash: string
  expiresAt: Date
  revokedAt: Date
  replacedById: number

  // audit fields
  createdBy?: number
  createdAt?: Date
  updatedBy?: number
  updatedAt?: Date
  deletedAt?: Date
}

export class RefreshTokenEntity {
  private constructor(
    private readonly id: number,
    private readonly userId: number,
    private readonly tokenHash: string,
    private readonly expiresAt: Date,
    private readonly revokedAt: Date,
    private readonly replacedById: number,
    private readonly createdBy?: number,
    private readonly createdAt?: Date,
    private readonly updatedBy?: number,
    private readonly updatedAt?: Date,
    private readonly deletedAt?: Date,
  ) {}

  static create(params: PrimitiveRefreshToken): RefreshTokenEntity {
    return new RefreshTokenEntity(
      params.id,
      params.userId,
      params.tokenHash,
      params.expiresAt,
      params.revokedAt,
      params.replacedById,
      params.createdBy,
      params.createdAt ?? new Date(),
      params.updatedBy,
      params.updatedAt,
      params.deletedAt,
    )
  }

  toValue(): PrimitiveRefreshToken {
    return {
      id: this.id,
      userId: this.userId,
      tokenHash: this.tokenHash,
      expiresAt: this.expiresAt,
      revokedAt: this.revokedAt,
      replacedById: this.replacedById,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedBy: this.updatedBy,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    }
  }
}