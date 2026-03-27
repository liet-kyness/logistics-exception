type Props = {
  value: string;
  kind?: 'severity' | 'status' | 'sla';
};

function getClasses(value: string, kind?: Props['kind']) {
  if (kind === 'severity') {
    if (value === 'Critical') return 'bg-red-100 text-red-700';
    if (value === 'High') return 'bg-orange-100 text-orange-700';
    if (value === 'Medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-slate-100 text-slate-700';
  }

  if (kind === 'status') {
    if (value === 'Open') return 'bg-blue-100 text-blue-700';
    if (value === 'Retrying') return 'bg-amber-100 text-amber-700';
    if (value === 'Escalated') return 'bg-red-100 text-red-700';
    if (value === 'Resolved') return 'bg-emerald-100 text-emerald-700';
    return 'bg-slate-100 text-slate-700';
  }

  if (kind === 'sla') {
    if (value === 'Breached') return 'bg-red-100 text-red-700';
    if (value === 'At Risk') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  }

  return 'bg-slate-100 text-slate-700';
}

export function Badge({ value, kind }: Props) {
  return (
    <span className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-semibold ${getClasses(value, kind)}`}>
      {value}
    </span>
  );
}