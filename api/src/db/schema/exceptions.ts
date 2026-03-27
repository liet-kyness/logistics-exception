import {
  pgTable,
  varchar,
  timestamp,
  serial,
  integer,
  index,
  text,
} from 'drizzle-orm/pg-core';
import { shipments } from './shipments';

export const exceptions = pgTable(
    'exceptions',
    {
        id: serial('id').primaryKey(),
        exceptionId: varchar('exception_id', { length: 50 }).notNull().unique(),
        shipmentId: integer('shipment_id').notNull()
            .references(() => shipments.id, {onDelete: 'cascade' }),
        eventType: varchar('event_type', { length: 100 }).notNull(),
        exceptionStatus: varchar('exception_status', { length: 30 }).notNull(),
        severity: varchar('severity', { length: 20 }).notNull(),
        errorCategory: varchar('error_category', { length: 50 }).notNull(),
        errorCode: varchar('error_code', { length: 50 }).notNull(),
        errorMessage: text('error_message').notNull(),
        ownerTeam: varchar('owner_team', { length: 50 }).notNull(),
        firstOccurredAt: timestamp('first_occurred_at').notNull(),
        lastOccurredAt: timestamp('last_occurred_at').notNull(),
        slaDeadlineAt: timestamp('sla_deadline_at').notNull(),
        resolvedAt: timestamp('resolved_at'),
        resolutionNotes: text('resolution_notes'),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (table) => ({
        exceptionIdIdx: index('exceptions_exception_id_idx').on(table.exceptionId),
        shipmentIdIdx: index('exceptions_shipment_id_idx').on(table.shipmentId),
        statusIdx: index('exceptions_status_idx').on(table.exceptionStatus),
        severityIdx: index('exceptions_severity_idx').on(table.severity),
        ownerTeamIdx: index('exceptions_owner_team_idx').on(table.ownerTeam),
        slaDeadlineIdx: index('exceptions_sla_deadline_idx').on(table.slaDeadlineAt),
    })
);
