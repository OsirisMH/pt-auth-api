import { and, eq, isNull } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { refreshTokens } from '../schemas/refresh-tokens.schema';
import type { RefreshTokenRepoPort, RefreshTokenRecord } from '../../../../../core/application/ports/refresh-token-repo.port';

export class DrizzleRefreshTokenRepository implements RefreshTokenRepoPort {
  constructor(private readonly db: ReturnType<typeof drizzle>) {}

  async revokeActiveByEmployeeId(employeeId: number, now: Date): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: now })
      .where(and(eq(refreshTokens.employeeId, employeeId), isNull(refreshTokens.revokedAt)));
  }

  async createForUser(input: { employeeId: number; tokenHash: string; expiresAt: Date }): Promise<{ id: number }> {
    const rows = await this.db
      .insert(refreshTokens)
      .values({
        employeeId: input.employeeId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        createdByUserId: input.employeeId,
      })
      .returning({ id: refreshTokens.id });

    return { id: rows[0]!.id };
  }

  async findActiveByEmployeeId(employeeId: number): Promise<RefreshTokenRecord | null> {
    const rows = await this.db
      .select({
        id: refreshTokens.id,
        employeeId: refreshTokens.employeeId,
        tokenHash: refreshTokens.tokenHash,
        expiresAt: refreshTokens.expiresAt,
        revokedAt: refreshTokens.revokedAt,
      })
      .from(refreshTokens)
      .where(and(eq(refreshTokens.employeeId, employeeId), isNull(refreshTokens.revokedAt)))
      .limit(1);

    return rows[0] ?? null;
  }

  async revokeById(id: number, now: Date, replacedByRefreshTokenId?: number): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: now, replacedByRefreshTokenId: replacedByRefreshTokenId ?? null })
      .where(eq(refreshTokens.id, id));
  }
}