export type RefreshTokenRecord = {
  id: number;
  employeeId: number;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

export interface RefreshTokenRepoPort {
  revokeActiveByEmployeeId(employeeId: number, now: Date): Promise<void>;
  createForUser(input: { employeeId: number; tokenHash: string; expiresAt: Date }): Promise<{ id: number }>;
  findActiveByEmployeeId(employeeId: number): Promise<RefreshTokenRecord | null>;
  revokeById(id: number, now: Date, replacedByRefreshTokenId?: number): Promise<void>;
}