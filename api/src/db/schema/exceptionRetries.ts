import {
    pgTable,
    varchar,
    timestamp,
    serial,
    integer,
    index,
    text,
} from 'drizzle-orm/pg-core'

import { exceptions } from './exceptions';

export const exceptionRetries = pgTable(
    'exceptionRetries',
    {
        id: serial('id').primaryKey(),
    exceptionId: integer('exception_id')
      .notNull()
      .references(() => exceptions.id, { onDelete: 'cascade' }),
    retryNumber: integer('retry_number').notNull(),
    retryAt: timestamp('retry_at').notNull(),
    retryResult: varchar('retry_result', { length: 30 }).notNull(),
    retryMessage: text('retry_message'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => ({
        exceptionIdIdx: index('exception_retries_exception_id_idx').on(table.exceptionId),
    })
);
