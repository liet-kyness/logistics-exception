import { db } from "../db";
import { exceptions } from "../db/schema/exceptions";
import { sql, isNotNull, count, inArray } from 'drizzle-orm';

export async function getOverviewMetrics() {
    const now = new Date();

    const [openExceptionsResult] = await db.select({
        count: count()
    }).from(exceptions)
      .where(inArray(exceptions.exceptionStatus, ['Open', 'Retrying', 'Escalated']));

    const [slaBreachedResult] = await db.select({
        count: count()
    }).from(exceptions)
      .where(sql`${exceptions.resolvedAt} IS NULL AND ${exceptions.slaDeadlineAt} < ${now}`);

    const [avgResolutionTimeResult] = await db.select({
        avgHours: sql<number>`
        COALESCE(AVG(extract(epoch FROM (${exceptions.resolvedAt} - ${exceptions.firstOccurredAt})) / 3600), 0)`,
    }).from(exceptions)
      .where(isNotNull(exceptions.resolvedAt));

    const exceptionsByCategory = await db.select({
        category: exceptions.errorCategory,
        count: count(),
    }).from(exceptions)
      .groupBy(exceptions.errorCategory)
      .orderBy(exceptions.errorCategory);

    const exceptionsBySeverity = await db.select({
        severity: exceptions.severity,
        count: count(),
    }).from(exceptions)
      .groupBy(exceptions.severity)
      .orderBy(
        sql`
            case
                when ${exceptions.severity} = 'Critical' then 1
                when ${exceptions.severity} = 'High' then 2
                when ${exceptions.severity} = 'Medium' then 3
                when ${exceptions.severity} = 'Low' then 4
                else 5
            end`
      );
    
    return {
        openExceptions: Number(openExceptionsResult?.count ?? 0),
        slaBreached: Number(slaBreachedResult?.count ?? 0),
        avgResolutionHours: Number(avgResolutionTimeResult?.avgHours ?? 0),
        exceptionsByCategory: exceptionsByCategory.map((row) => ({
            category: row.category,
            count: Number(row.count),
        })),
        exceptionsBySeverity: exceptionsBySeverity.map((row) => ({
            severity: row.severity,
            count: Number(row.count),
        })),
    };
}
