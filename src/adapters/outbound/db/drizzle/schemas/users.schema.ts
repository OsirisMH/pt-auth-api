import { pgTable, bigint, varchar, integer, timestamp, text, bigserial } from 'drizzle-orm/pg-core';

export const users = pgTable('usuarios', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: varchar('nombre', { length: 100 }).notNull(),
  email: varchar('correo', { length: 100 }).notNull().unique(),
  password: text('contrasena_hash').notNull(),
  statusId: integer('estatus_id').notNull(),
  createdBy: bigint('usuario_creacion_id', { mode: 'number' }).notNull(),
  createdAt: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: bigint('usuario_modificacion_id', { mode: 'number' }),
  updatedAt: timestamp('fecha_modificacion', { withTimezone: true }),
  deletedAt: timestamp('fecha_eliminacion', { withTimezone: true }),
});