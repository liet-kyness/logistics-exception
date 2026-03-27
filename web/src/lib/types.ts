import { LargeNumberLike } from "crypto";

export type ExceptionRow = {
    id: number;
    exceptionId: string;
    status: string;
    severity: string;
    category: string;
    ownerTeam: string;
    lastOccurredAt: string;
    slaDeadlineAt: string;
    shipmentId: string | null;
    carrierName: string | null;
    originDc: string | null;
    destinationRegion: string | null;
};

export type ExceptionsResponse = {
    data: ExceptionRow[];
};

export type OverviewMetric = {
    data: {
        openExceptions: number;
        slaBreached: number;
        avgResolutionHours: number;
        exceptionsByCategory: Array<{
            category: string;
            count: number;
        }>;
        exceptionsBySeverity: Array<{
            severity: string;
            count: number;
        }>;
    };
};

export type ExceptionDetailResponse = {
    data: {
        exception: {
        id: number;
        exceptionId: string;
        shipmentRowId: number;
        eventType: string;
        exceptionStatus: string;
        severity: string;
        errorCategory: string;
        errorCode: string;
        errorMessage: string;
        ownerTeam: string;
        firstOccurredAt: string;
        lastOccurredAt: string;
        slaDeadlineAt: string;
        resolvedAt: string | null;
        resolutionNotes: string | null;
        createdAt: string;
        updatedAt: string;
        };
        shipment: {
        id: number;
        shipmentId: string;
        orderId: string;
        carrierName: string;
        originDc: string;
        destinationRegion: string;
        mode: string;
        currentStatus: string;
        plannedPickupAt: string | null;
        actualPickupAt: string | null;
        plannedDeliveryAt: string | null;
        actualDeliveryAt: string | null;
        createdAt: string;
        updatedAt: string;
        } | null;
        retries: Array<{
        id: number;
        exceptionId: number;
        retryNumber: number;
        retryAt: string;
        retryResult: string;
        retryMessage: string | null;
        createdAt: string;
        }>;
        history: Array<{
        id: number;
        exceptionId: number;
        oldStatus: string;
        newStatus: string;
        changedAt: string;
        changedBy: string;
        note: string | null;
        }>;
    };
};