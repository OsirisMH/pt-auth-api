import { pgTable, varchar, timestamp, bigserial, bigint } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const employeeRoles = pgTable(
  'roles_empleado',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    employeeId: bigint('empleado_id', { mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    appId: bigint('app_id', { mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    role: varchar('rol', { length: 80 }).notNull(),

    // audit fields
    grantBy: bigint('fecha_otorgamiento', { mode: 'number' }),
    grantAt: timestamp('fecha_revocacion', { withTimezone: true }).notNull().defaultNow(),
    revokeBy: bigint('revocado_por_empleado_id', { mode: 'number' }),
    revokeAt: timestamp('fecha_revocacion', { withTimezone: true }),
  },
);