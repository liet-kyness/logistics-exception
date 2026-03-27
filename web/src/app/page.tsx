import { LayoutShell } from '@/components/layout-shell';
import { StatCard } from '@/components/stat-card';
import { getOverviewMetrics } from '@/lib/api';

export default async function HomePage() {
  const { data } = await getOverviewMetrics();

  return (
    <LayoutShell
      title="Overview"
      subtitle="Operational visibility for shipment exceptions, SLA risk, and resolution performance."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Exceptions" value={data.openExceptions} />
        <StatCard label="SLA Breaches" value={data.slaBreached} />
        <StatCard
          label="Avg Resolution Hours"
          value={data.avgResolutionHours.toFixed(1)}
        />
        <StatCard
          label="Tracked Categories"
          value={data.exceptionsByCategory.length}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Exceptions by Category</h3>
          <div className="mt-4 space-y-3">
            {data.exceptionsByCategory.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between rounded-sm border border-slate-100 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-700">{item.category}</span>
                <span className="text-sm font-bold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Exceptions by Severity</h3>
          <div className="mt-4 space-y-3">
            {data.exceptionsBySeverity.map((item) => (
              <div
                key={item.severity}
                className="flex items-center justify-between rounded-sm border border-slate-100 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-700">{item.severity}</span>
                <span className="text-sm font-bold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </LayoutShell>
  );
}
