import { pgTable, bigint, text, timestamp, uniqueIndex, bigserial } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const refreshTokens = pgTable(
  'tokens_refresco',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    employeeId: bigint('empleado_id', { mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('hash_token').notNull(),
    expiresAt: timestamp('fecha_expiracion', { withTimezone: true }).notNull(),
    revokedAt: timestamp('fecha_revocacion', { withTimezone: true }),
    replacedByRefreshTokenId: bigint('reemplazado_por_id', { mode: 'number' }),
    createdByUserId: bigint('creado_por_empleado_id', { mode: 'number' }).notNull(),
    createdAt: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  },
);