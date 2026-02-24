import { pgTable, bigint, varchar, integer, timestamp, text, bigserial } from 'drizzle-orm/pg-core';
import { departments } from './department.schema';
import { positions } from './position.schema';

export const employees = pgTable('empleados', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: varchar('nombre', { length: 100 }).notNull(),
  email: varchar('correo', { length: 100 }).notNull().unique(),
  password: text('contrasena_hash').notNull(),
  
  positionId: bigint('puesto_id', { mode: 'number' }).notNull()
    .references(() => positions.id, { onDelete: 'restrict' }),
  departmentId: bigint('departamento_id', { mode: 'number' }).notNull()
    .references(() => departments.id, { onDelete: 'restrict' }),

  statusId: integer('estatus_id').notNull(),

  createdBy: bigint('usuario_creacion_id', { mode: 'number' }).notNull(),
  createdAt: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: bigint('usuario_modificacion_id', { mode: 'number' }),
  updatedAt: timestamp('fecha_modificacion', { withTimezone: true }),
  deletedAt: timestamp('fecha_eliminacion', { withTimezone: true }),
});