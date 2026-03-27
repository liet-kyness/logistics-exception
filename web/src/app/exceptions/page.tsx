import Link from 'next/link';
import { Badge } from '@/components/badge';
import { LayoutShell } from '@/components/layout-shell';
import { getExceptions } from '@/lib/api';

function getSlaState(deadline: string) {
    const now = new Date();
    const due = new Date(deadline);
    const diffHours = (due.getTime() - now.getTime()) / (100 * 60 * 60);

    if (diffHours < 0) return 'Breached';
    if (diffHours <= 4) return 'At Risk';
    return 'Healthy';
}

type SearchParams = {
    status?: string;
    severity?: string;
    ownerTeam?: string;
    search?: string;
};

type Props = {
    searchParams: Promise<SearchParams>;
};

const buildExceptionsHref = (current: SearchParams, updates: Partial<SearchParams>) => {
    const next = {
        ...current,
        ...updates,
    };
    const cleanedEntries = Object.entries(next).filter(
        (entry): entry is [string, string] =>
            typeof entry[1] === 'string' && entry[1].length >0
    );
    const query = new URLSearchParams(cleanedEntries).toString();
    return query ? `/exceptions?${query}` : '/exceptions';
}

export default async function ExceptionsPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;
    
    const query = new URLSearchParams(
        Object.entries(resolvedSearchParams).filter(
            (entry): entry is [string, string] =>
                typeof entry[1] === "string" && entry[1].length > 0)
    ).toString();

    const { data } = await getExceptions(query);
    
    return (
        <LayoutShell
        title="Exception Queue"
        subtitle="Filterable queue of active and historical logistics exceptions."
        >
            <div className="mb-6 rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
            <form action="/exceptions" className="flex flex-col gap-3 sm:flex-row">
                <input
                type="text"
                name="search"
                defaultValue={resolvedSearchParams.search ?? ''}
                placeholder="Search exception ID, shipment ID, or carrier..."
                className="flex-1 rounded-sm border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-500"
                />
                <button
                type="submit"
                className="rounded-sm bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                Search
                </button>
                <Link
                href="/exceptions"
                className="inline-flex items-center justify-center rounded-sm border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                Clear
                </Link>
            </form>
            </div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-slate-600">Filters:</span>

                {/* Status */}
                <Link href="/exceptions" className={!resolvedSearchParams.search && !resolvedSearchParams.status && !resolvedSearchParams.severity ? 'text-sm font-semibold text-slate-900' : 'text-sm text-slate-500 hover:text-slate-900'}>
                    All
                </Link>

                <Link href={buildExceptionsHref(resolvedSearchParams, { status: 'Open' })} className={resolvedSearchParams.status === 'Open' ? 'text-sm font-semibold text-slate-900' : 'text-sm text-slate-500 hover:text-slate-900'}>
                    Open
                </Link>

                <Link href={buildExceptionsHref(resolvedSearchParams, { status: 'Retrying' })} className={resolvedSearchParams.status === 'Retrying' ? 'text-sm font-semibold text-slate-900' : 'text-sm text-slate-500 hover:text-slate-900'}>
                    Retrying
                </Link>

                <Link href={buildExceptionsHref(resolvedSearchParams, { status: 'Escalated' })} className={resolvedSearchParams.status === 'Escalated' ? 'text-sm font-semibold text-slate-900' : 'text-sm text-slate-500 hover:text-slate-900'}>
                    Escalated
                </Link>

                <span className="mx-2 text-slate-300">|</span>

                {/* Severity */}
                <Link href={buildExceptionsHref(resolvedSearchParams, { severity: 'Critical' })} className={resolvedSearchParams.severity === 'Critical' ? 'text-sm font-semibold text-slate-900' : 'text-sm text-slate-500 hover:text-slate-900'}>
                    Critical
                </Link>

                <Link href={buildExceptionsHref(resolvedSearchParams, { severity: 'High' })} className={resolvedSearchParams.severity === 'High' ? 'text-sm font-semibold text-slate-900' : 'text-sm text-slate-500 hover:text-slate-900'}>
                    High
                </Link>

                <Link href={buildExceptionsHref(resolvedSearchParams, { severity: 'Medium' })} className={resolvedSearchParams.severity === 'Medium' ? 'text-sm font-semibold text-slate-900' : 'text-sm text-slate-500 hover:text-slate-900'}>
                    Medium
                </Link>
                </div>
            <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="border-b bg-slate-50 text-slate-600">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Exception</th>
                        <th className="px-4 py-3 font-semibold">Shipment</th>
                        <th className="px-4 py-3 font-semibold">Carrier</th>
                        <th className="px-4 py-3 font-semibold">Category</th>
                        <th className="px-4 py-3 font-semibold">Severity</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Owner</th>
                        <th className="px-4 py-3 font-semibold">SLA</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => {
                        const slaState = getSlaState(row.slaDeadlineAt);

                        return (
                        <tr key={row.id} className="border-b last:border-b-0 hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-900">
                            <Link href={`/exceptions/${row.id}`} className="hover:underline">
                                {row.exceptionId}
                            </Link>
                            </td>
                            <td className="px-4 py-3 text-slate-700">{row.shipmentId ?? '—'}</td>
                            <td className="px-4 py-3 text-slate-700">{row.carrierName ?? '—'}</td>
                            <td className="px-4 py-3 text-slate-700">{row.category}</td>
                            <td className="px-4 py-3"><Badge value={row.severity} kind="severity" /></td>
                            <td className="px-4 py-3"><Badge value={row.status} kind="status" /></td>
                            <td className="px-4 py-3 text-slate-700">{row.ownerTeam}</td>
                            <td className="px-4 py-3"><Badge value={slaState} kind="sla" /></td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
        </div>
    </LayoutShell>
  ); 
}