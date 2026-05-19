import { Period } from '../types';
import { cn } from '../lib/utils';

interface PeriodFiltersProps {
  current: Period;
  onChange: (period: Period) => void;
}

export function PeriodFilters({ current, onChange }: PeriodFiltersProps) {
  const periods: { value: Period; label: string }[] = [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' },
    { value: 'all', label: 'Tudo' },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-secondary/10 rounded-2xl mb-8 border border-secondary/20">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            current === p.value 
              ? "bg-white text-ink shadow-sm border border-secondary/20" 
              : "text-slate-400 hover:text-ink"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
