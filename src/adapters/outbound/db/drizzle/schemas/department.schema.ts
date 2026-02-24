import { pgTable, bigint, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const departments = pgTable('departamentos', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('nombre', { length: 120 }).notNull(),
  description: text('descripcion'),

  // ? Audit fields
  createdBy: bigint('usuario_creacion_id', { mode: 'number' }).notNull(),
  createdAt: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: bigint('usuario_modificacion_id', { mode: 'number' }),
  updatedAt: timestamp('fecha_modificacion', { withTimezone: true }),
  deletedAt: timestamp('fecha_eliminacion', { withTimezone: true }),
});