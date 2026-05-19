import { formatCurrency } from '../lib/utils';

interface MonthlySummaryProps {
  income: number;
  expense: number;
}

export function MonthlySummary({ income, expense }: MonthlySummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Entradas (Mês)</p>
        <p className="text-xl font-black text-ink">{formatCurrency(income)}</p>
      </div>
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Saídas (Mês)</p>
        <p className="text-xl font-black text-alert">{formatCurrency(expense)}</p>
      </div>
    </div>
  );
}
