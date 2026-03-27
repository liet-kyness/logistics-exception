import {
    pgTable,
    varchar,
    timestamp,
    serial,
    index,
} from 'drizzle-orm/pg-core';

export const shipments = pgTable(
    'shipments',
    {
        id: serial('id').primaryKey(),
        shipmentId: varchar('shipment_id', { length: 50 }).notNull().unique(),
        orderId: varchar('order_id', { length: 50 }).notNull(),
        originDc: varchar('origin_dc', { length: 50 }).notNull(),
        carrierName: varchar('carrier_name', { length: 100 }).notNull(),
        destinationRegion: varchar('destination_region', { length: 50 }).notNull(),
        mode: varchar('mode', { length: 30 }).notNull(),
        currentStatus: varchar('current_status', { length: 50 }).notNull(),
        plannedPickupAt: timestamp('planned_pickup_at'),
        actualPickupAt: timestamp('actual_pickup_at'),
        plannedDeliveryAt: timestamp('planned_delivery_at'),
        actualDeliveryAt: timestamp('actual_delivery_at'),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (table) => ({
        shipmentIdIdx: index('shipments_shipment_id_idx').on(table.shipmentId),
        orderIdIdx: index('shipments_order_id_idx').on(table.orderId),
        statusIdIdx: index('shipments_current_status_idx').on(table.currentStatus),
    })
);
