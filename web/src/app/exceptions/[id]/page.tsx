import { LayoutShell } from "@/components/layout-shell";
import { getExceptionById } from "@/lib/api";
import Link from "next/link";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ExceptionDetailPage({ params }: Props) {
    const { id } = await params;
    const { data } = await getExceptionById(id);

    const exception = data.exception;
    const shipment = data.shipment;

    return (
    <LayoutShell
      title={exception.exceptionId}
      subtitle="Detailed exception view with shipment context, retries, and status history."
    >
      <div className="mb-4">
        <Link href='/exceptions' className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          -Back
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Exception Summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p><span className="font-semibold">Event Type:</span> {exception.eventType}</p>
            <p><span className="font-semibold">Status:</span> {exception.exceptionStatus}</p>
            <p><span className="font-semibold">Severity:</span> {exception.severity}</p>
            <p><span className="font-semibold">Category:</span> {exception.errorCategory}</p>
            <p><span className="font-semibold">Error Code:</span> {exception.errorCode}</p>
            <p><span className="font-semibold">Owner Team:</span> {exception.ownerTeam}</p>
            <p><span className="font-semibold">Message:</span> {exception.errorMessage}</p>
            <p><span className="font-semibold">Resolution Notes:</span> {exception.resolutionNotes ?? '—'}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Shipment Context</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p><span className="font-semibold">Shipment ID:</span> {shipment?.shipmentId ?? '—'}</p>
            <p><span className="font-semibold">Order ID:</span> {shipment?.orderId ?? '—'}</p>
            <p><span className="font-semibold">Carrier:</span> {shipment?.carrierName ?? '—'}</p>
            <p><span className="font-semibold">Origin DC:</span> {shipment?.originDc ?? '—'}</p>
            <p><span className="font-semibold">Destination:</span> {shipment?.destinationRegion ?? '—'}</p>
            <p><span className="font-semibold">Mode:</span> {shipment?.mode ?? '—'}</p>
            <p><span className="font-semibold">Shipment Status:</span> {shipment?.currentStatus ?? '—'}</p>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Retry History</h3>
          <div className="mt-4 space-y-3">
            {data.retries.length === 0 ? (
              <p className="text-sm text-slate-500">No retries recorded.</p>
            ) : (
              data.retries.map((retry) => (
                <div key={retry.id} className="rounded-xl border border-slate-100 p-3 text-sm">
                  <p className="font-semibold text-slate-900">Retry #{retry.retryNumber}</p>
                  <p className="text-slate-600">Result: {retry.retryResult}</p>
                  <p className="text-slate-600">At: {new Date(retry.retryAt).toLocaleString()}</p>
                  <p className="text-slate-600">{retry.retryMessage ?? '—'}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Status History</h3>
          <div className="mt-4 space-y-3">
            {data.history.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-100 p-3 text-sm">
                <p className="font-semibold text-slate-900">
                  {item.oldStatus} → {item.newStatus}
                </p>
                <p className="text-slate-600">By: {item.changedBy}</p>
                <p className="text-slate-600">
                  At: {new Date(item.changedAt).toLocaleString()}
                </p>
                <p className="text-slate-600">{item.note ?? '—'}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </LayoutShell>
  );
}
