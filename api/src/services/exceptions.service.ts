import { db } from '../db';
import { exceptions } from '../db/schema/exceptions';
import { shipments } from '../db/schema/shipments';
import { exceptionRetries } from '../db/schema/exceptionRetries';
import { statusHistory } from '../db/schema/statusHistory';
import { eq, ilike, and, or } from 'drizzle-orm';

type GetExceptionFilters = { 
    status?: string | undefined;
    severity?: string | undefined;
    ownerTeam?: string | undefined;
    search?: string | undefined;
};

export async function getExceptions(filters: GetExceptionFilters) {
    const conditions = [];

    if (filters.status) {
        conditions.push(eq(exceptions.exceptionStatus, filters.status));
    }
    if (filters.severity) {
        conditions.push(eq(exceptions.severity, filters.severity));
    }
    if (filters.ownerTeam) {
        conditions.push(eq(exceptions.ownerTeam, filters.ownerTeam));
    }
    if (filters.search) {
        const term = filters.search.trim();
        conditions.push(
            or(
                ilike(exceptions.exceptionId, `%${term}%`),
                ilike(shipments.shipmentId, `%${term}%`),
                ilike(shipments.carrierName, `%${term}%`),
            )!
        );
    }

    const results = await db.select({
        id: exceptions.id,
        exceptionId: exceptions.exceptionId,
        status: exceptions.exceptionStatus,
        severity: exceptions.severity,
        category: exceptions.errorCategory,
        ownerTeam: exceptions.ownerTeam,
        lastOccurredAt: exceptions.lastOccurredAt,
        slaDeadlineAt: exceptions.slaDeadlineAt,

        shipmentId: shipments.shipmentId,
        carrierName: shipments.carrierName,
        originDc: shipments.originDc,
        destinationRegion: shipments.destinationRegion,
    }).from(exceptions)
      .leftJoin(shipments, eq(exceptions.shipmentId, shipments.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(exceptions.lastOccurredAt);

    return results;
}

export async function getExceptionById(id: number) {
    const [result] = await db.select({
        exception: {
            id: exceptions.id,
            exceptionId: exceptions.exceptionId,
            shipmentRowId: exceptions.shipmentId,
            eventType: exceptions.eventType,
            exceptionStatus: exceptions.exceptionStatus,
            severity: exceptions.severity,
            errorCategory: exceptions.errorCategory,
            errorCode: exceptions.errorCode,
            errorMessage: exceptions.errorMessage,
            ownerTeam: exceptions.ownerTeam,
            firstOccurredAt: exceptions.firstOccurredAt,
            lastOccurredAt: exceptions.lastOccurredAt,
            slaDeadlineAt: exceptions.slaDeadlineAt,
            resolvedAt: exceptions.resolvedAt,
            resolutionNotes: exceptions.resolutionNotes,
            createdAt: exceptions.createdAt,
            updatedAt: exceptions.updatedAt,
        },
        shipment: {
            id: shipments.id,
            shipmentId: shipments.shipmentId,
            orderId: shipments.orderId,
            carrierName: shipments.carrierName,
            originDc: shipments.originDc,
            destinationRegion: shipments.destinationRegion,
            mode: shipments.mode,
            currentStatus: shipments.currentStatus,
            plannedPickupAt: shipments.plannedPickupAt,
            actualPickupAt: shipments.actualPickupAt,
            plannedDeliveryAt: shipments.plannedDeliveryAt,
            actualDeliveryAt: shipments.actualDeliveryAt,
            createdAt: shipments.createdAt,
            updatedAt: shipments.updatedAt,
        },
    }).from(exceptions)
      .leftJoin(shipments, eq(exceptions.shipmentId, shipments.id))
      .where(eq(exceptions.id, id));
    
    if (!result) return null;

    const retries = await db.select({
        id: exceptionRetries.id,
        exceptionId: exceptionRetries.exceptionId,
        retryNumber: exceptionRetries.retryNumber,
        retryAt: exceptionRetries.retryAt,
        retryResult: exceptionRetries.retryResult,
        retryMessage: exceptionRetries.retryMessage,
        createdAt: exceptionRetries.createdAt,
    }).from(exceptionRetries)
      .where(eq(exceptionRetries.exceptionId, id))
      .orderBy(exceptionRetries.retryAt);
    
    const history = await db.select({
        id: statusHistory.id,
        exceptionId: statusHistory.exceptionId,
        oldStatus: statusHistory.oldStatus,
        newStatus: statusHistory.newStatus,
        changedAt: statusHistory.changedAt,
        changedBy: statusHistory.changedBy,
        note: statusHistory.note,
    }).from(statusHistory)
      .where(eq(statusHistory.exceptionId, id))
      .orderBy(statusHistory.changedAt);
    
    return {
        exception: result.exception,
        shipment: result.shipment,
        retries,
        history,
    };
}