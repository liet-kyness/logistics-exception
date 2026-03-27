import {
    pgTable,
    varchar,
    timestamp,
    serial,
    integer,
    index,
    text
} from 'drizzle-orm/pg-core';

import { exceptions } from './exceptions';

export const statusHistory = pgTable(
    'status_history',
    {
        id: serial('id').primaryKey(),
        exceptionId: integer('exception_id').notNull()
            .references(() => exceptions.id, { onDelete: 'cascade' }),
        oldStatus: varchar('old_status', { length: 30 }).notNull(),
        newStatus: varchar('new_status', { length: 30 }).notNull(),
        changedAt: timestamp('changed_at').defaultNow().notNull(),
        changedBy: varchar('changed_by', { length: 100 }).notNull(),
        note: text('note'),
    },
    (table) => ({
        exceptionIdIdx: index('status_history_exception_id_idx').on(table.exceptionId),
        changedAtIdx: index('status_history_changed_at_idx').on(table.changedAt),
    })
);