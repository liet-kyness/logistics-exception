type Props = {
    label: string;
    value: string | number;
    subtext?: string;
};

export function StatCard({ label, value, subtext }: Props) {
    return (
        <div className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3x1 font-bold text-slate-900">{value}</p>
            {subtext ? <p className="mt-2 text-xs text-slate-500">{subtext}</p> : null}
        </div>
    );
}