import { pgTable, bigint, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const apps = pgTable('apps', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  key: varchar('clave', { length: 60 }).notNull(),
  name: varchar('nombre', { length: 120 }),

  // ? Audit fields
  createdAt: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('fecha_eliminacion', { withTimezone: true }),
});