import 'dotenv/config';
import { db, pool } from './index';
import { shipments } from './schema/shipments';
import { exceptions } from './schema/exceptions';
import { exceptionRetries } from './schema/exceptionRetries';
import { statusHistory } from './schema/statusHistory';

type ShipmentStatus =
  | 'Pending Pickup'
  | 'In Transit'
  | 'Delayed'
  | 'Delivered'
  | 'Exception';

type ExceptionStatus =
  | 'Open'
  | 'Retrying'
  | 'Escalated'
  | 'Resolved'
  | 'Closed';

type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

type ErrorCategory =
  | 'Planning'
  | 'Documentation'
  | 'Warehouse'
  | 'Carrier'
  | 'Integration'
  | 'External';

type OwnerTeam =
  | 'Ops'
  | 'Carrier Management'
  | 'Warehouse'
  | 'Customer Support'
  | 'Integration Support';

type RetryResult = 'Success' | 'Failed' | 'Timed Out' | 'Skipped';

const carriers = [
  'BlueLine Freight',
  'Summit Logistics',
  'NorthStar Transport',
  'RapidRoute Parcel',
  'IronPeak Carriers',
];

const origins = ['ATL-DC01', 'MEM-DC02', 'DFW-DC03', 'CHI-DC04'];

const regions = ['Southeast', 'Midwest', 'Northeast', 'Gulf Coast'];

const modes = ['LTL', 'FTL', 'Parcel', 'Intermodal'];

const shipmentStatuses: ShipmentStatus[] = [
  'Pending Pickup',
  'In Transit',
  'Delayed',
  'Delivered',
  'Exception',
];

const exceptionStatuses: ExceptionStatus[] = [
  'Open',
  'Retrying',
  'Escalated',
  'Resolved',
  'Closed',
];

const severities: Severity[] = ['Low', 'Medium', 'High', 'Critical'];

const categories: ErrorCategory[] = [
  'Planning',
  'Documentation',
  'Warehouse',
  'Carrier',
  'Integration',
  'External',
];

const ownerTeams: OwnerTeam[] = [
  'Ops',
  'Carrier Management',
  'Warehouse',
  'Customer Support',
  'Integration Support',
];

const eventTypes = [
  'EDI 214 Update Failed',
  'ASN Missing',
  'Rate Tender Rejected',
  'POD Not Received',
  'Shipment Delayed',
  'Destination Mapping Error',
  'Duplicate Shipment Record',
  'Warehouse Pick Not Confirmed',
  'Carrier API Timeout',
  'Documentation Mismatch',
];

const errorMessages = [
  'Carrier status update not received within expected interval.',
  'ASN record missing required fields for downstream processing.',
  'Carrier rejected tender due to capacity constraint.',
  'Proof of delivery not received after shipment completion.',
  'Shipment exceeded planned delivery window.',
  'Destination code failed region mapping validation.',
  'Duplicate shipment detected during ingestion.',
  'Warehouse pick confirmation missing after release.',
  'Carrier integration timed out during retry window.',
  'Bill of lading details do not match shipment payload.',
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedSeverity(): Severity {
  const roll = Math.random();
  if (roll < 0.1) return 'Low';
  if (roll < 0.65) return 'Medium';
  if (roll < 0.9) return 'High';
  return 'Critical';
}

function weightedCategory(): ErrorCategory {
  const roll = Math.random();
  if (roll < 0.1) return 'Planning';
  if (roll < 0.2) return 'Documentation';
  if (roll < 0.35) return 'Warehouse';
  if (roll < 0.75) return 'Carrier';
  if (roll < 0.95) return 'Integration';
  return 'External';
}

function weightedExceptionStatus(): ExceptionStatus {
  const roll = Math.random();
  if (roll < 0.45) return 'Open';
  if (roll < 0.65) return 'Retrying';
  if (roll < 0.82) return 'Escalated';
  if (roll < 0.94) return 'Resolved';
  return 'Closed';
}

function daysAgo(days: number, hourOffset = 0): Date {
  const now = new Date();
  const d = new Date(now);
  d.setDate(now.getDate() - days);
  d.setHours(d.getHours() - hourOffset);
  return d;
}

function hoursFrom(date: Date, hours: number): Date {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
}

function buildResolutionNotes(status: ExceptionStatus): string | null {
  if (status === 'Resolved' || status === 'Closed') {
    return randomItem([
      'Carrier resent update and shipment synced successfully.',
      'Ops team corrected shipment data and reprocessed the event.',
      'Warehouse confirmed pick status and exception cleared.',
      'Retry succeeded after integration timeout was resolved.',
      'Support team reconciled documentation mismatch with carrier.',
    ]);
  }

  return null;
}

async function main() {
  console.log('Seeding database...');

  // delete child tables first
  await db.delete(statusHistory);
  await db.delete(exceptionRetries);
  await db.delete(exceptions);
  await db.delete(shipments);

  const insertedShipments = await db
    .insert(shipments)
    .values(
      Array.from({ length: 100 }).map((_, i) => {
        const shipmentStatus = randomItem(shipmentStatuses);
        const plannedPickupAt = daysAgo(randomInt(3, 20), randomInt(1, 12));
        const plannedDeliveryAt = hoursFrom(plannedPickupAt, randomInt(24, 120));

        const actualPickupAt =
          shipmentStatus === 'Pending Pickup' ? null : hoursFrom(plannedPickupAt, randomInt(0, 8));

        const actualDeliveryAt =
          shipmentStatus === 'Delivered'
            ? hoursFrom(plannedDeliveryAt, randomInt(-4, 18))
            : null;

        return {
          shipmentId: `SHP-${100000 + i}`,
          orderId: `ORD-${200000 + i}`,
          carrierName: randomItem(carriers),
          originDc: randomItem(origins),
          destinationRegion: randomItem(regions),
          mode: randomItem(modes),
          currentStatus: shipmentStatus,
          plannedPickupAt,
          actualPickupAt,
          plannedDeliveryAt,
          actualDeliveryAt,
        };
      })
    )
    .returning();

  const insertedExceptions = await db
    .insert(exceptions)
    .values(
      Array.from({ length: 45 }).map((_, i) => {
        const shipment = randomItem(insertedShipments);
        const firstOccurredAt = daysAgo(randomInt(0, 10), randomInt(1, 20));
        const lastOccurredAt = hoursFrom(firstOccurredAt, randomInt(1, 18));
        const status = weightedExceptionStatus();
        const severity = weightedSeverity();
        const category = weightedCategory();
        const resolvedAt =
          status === 'Resolved' || status === 'Closed'
            ? hoursFrom(lastOccurredAt, randomInt(1, 12))
            : null;

        const slaDeadlineAt =
          status === 'Resolved' || status === 'Closed'
            ? hoursFrom(firstOccurredAt, randomInt(4, 24))
            : hoursFrom(firstOccurredAt, randomInt(4, 36));

        return {
          exceptionId: `EXC-${300000 + i}`,
          shipmentId: shipment.id,
          eventType: randomItem(eventTypes),
          exceptionStatus: status,
          severity,
          errorCategory: category,
          errorCode: `ERR-${randomInt(1000, 9999)}`,
          errorMessage: randomItem(errorMessages),
          ownerTeam:
            category === 'Carrier'
              ? 'Carrier Management'
              : category === 'Warehouse'
                ? 'Warehouse'
                : category === 'Integration'
                  ? 'Integration Support'
                  : randomItem(ownerTeams),
          firstOccurredAt,
          lastOccurredAt,
          slaDeadlineAt,
          resolvedAt,
          resolutionNotes: buildResolutionNotes(status),
        };
      })
    )
    .returning();

  const retryRows: Array<{
    exceptionId: number;
    retryNumber: number;
    retryAt: Date;
    retryResult: RetryResult;
    retryMessage: string | null;
  }> = [];

  const historyRows: Array<{
    exceptionId: number;
    oldStatus: string;
    newStatus: string;
    changedAt: Date;
    changedBy: string;
    note: string | null;
  }> = [];

  for (const exception of insertedExceptions) {
    const retryCount =
      exception.exceptionStatus === 'Open'
        ? randomInt(0, 1)
        : exception.exceptionStatus === 'Retrying'
          ? randomInt(1, 3)
          : exception.exceptionStatus === 'Escalated'
            ? randomInt(1, 2)
            : randomInt(0, 2);

    let previousStatus = 'Open';

    historyRows.push({
      exceptionId: exception.id,
      oldStatus: 'Open',
      newStatus: 'Open',
      changedAt: exception.firstOccurredAt,
      changedBy: 'system',
      note: 'Exception created by monitoring workflow.',
    });

    if (exception.exceptionStatus !== 'Open') {
      const transitionPath =
        exception.exceptionStatus === 'Retrying'
          ? ['Retrying']
          : exception.exceptionStatus === 'Escalated'
            ? ['Retrying', 'Escalated']
            : exception.exceptionStatus === 'Resolved'
              ? ['Retrying', 'Resolved']
              : ['Retrying', 'Resolved', 'Closed'];

      let lastChangeAt = exception.firstOccurredAt;

      for (const nextStatus of transitionPath) {
        lastChangeAt = hoursFrom(lastChangeAt, randomInt(1, 8));

        historyRows.push({
          exceptionId: exception.id,
          oldStatus: previousStatus,
          newStatus: nextStatus,
          changedAt: lastChangeAt,
          changedBy: nextStatus === 'Closed' ? 'ops.manager' : 'ops.user',
          note:
            nextStatus === 'Retrying'
              ? 'Retry initiated after initial exception detection.'
              : nextStatus === 'Escalated'
                ? 'Escalated after repeated failure.'
                : nextStatus === 'Resolved'
                  ? 'Exception resolved after remediation.'
                  : 'Closed after verification.',
        });

        previousStatus = nextStatus;
      }
    }

    for (let retryNumber = 1; retryNumber <= retryCount; retryNumber++) {
      retryRows.push({
        exceptionId: exception.id,
        retryNumber,
        retryAt: hoursFrom(exception.firstOccurredAt, retryNumber * randomInt(1, 4)),
        retryResult: randomItem<RetryResult>(['Success', 'Failed', 'Timed Out', 'Skipped']),
        retryMessage: randomItem([
          'Retry failed due to upstream timeout.',
          'Retry completed successfully.',
          'Carrier endpoint unavailable during retry.',
          'Retry skipped because exception was reassigned.',
          'Retry failed due to validation error.',
        ]),
      });
    }
  }

  if (retryRows.length > 0) {
    await db.insert(exceptionRetries).values(retryRows);
  }

  if (historyRows.length > 0) {
    await db.insert(statusHistory).values(historyRows);
  }

  console.log(`Inserted ${insertedShipments.length} shipments`);
  console.log(`Inserted ${insertedExceptions.length} exceptions`);
  console.log(`Inserted ${retryRows.length} retry rows`);
  console.log(`Inserted ${historyRows.length} status history rows`);
  console.log('Seed complete.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });