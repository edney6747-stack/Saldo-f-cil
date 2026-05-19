import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Transaction } from '../types';
import { format, startOfDay, subDays, isSameDay, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

interface FinancialChartProps {
  transactions: Transaction[];
}

const COLORS = ['#87CEEB', '#C8A2C8', '#98FB98', '#FFA07A', '#F08080', '#FFD700', '#40E0D0', '#EE82EE'];

export function FinancialChart({ transactions }: FinancialChartProps) {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [chartType, setChartType] = useState<'evolution' | 'distribution'>('evolution');

  const evolutionData = useMemo(() => {
    const now = startOfDay(new Date());
    
    if (view === 'week') {
      return Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(now, 6 - i);
        const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), date));
        
        const income = dayTransactions
          .filter(t => t.type === 'income')
          .reduce((acc, t) => acc + t.amount, 0);
        
        const expense = dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0);

        return {
          name: format(date, 'EEE', { locale: ptBR }),
          balance: income - expense,
          income,
          expense,
          fullDate: format(date, "dd 'de' MMM", { locale: ptBR })
        };
      });
    } else {
      return Array.from({ length: 30 }).map((_, i) => {
        const date = subDays(now, 29 - i);
        const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), date));
        
        const income = dayTransactions
          .filter(t => t.type === 'income')
          .reduce((acc, t) => acc + t.amount, 0);
        
        const expense = dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0);

        return {
          name: format(date, 'dd'),
          balance: income - expense,
          income,
          expense,
          fullDate: format(date, "dd/MM")
        };
      });
    }
  }, [transactions, view]);

  const distributionData = useMemo(() => {
    const now = new Date();
    const start = view === 'week' ? subDays(now, 6) : startOfMonth(now);
    const end = endOfMonth(now);

    const periodExpenses = transactions.filter(t => 
      t.type === 'expense' && 
      isWithinInterval(new Date(t.date), { start, end: now })
    );

    const categories: Record<string, { name: string; value: number; icon: string }> = {};
    
    periodExpenses.forEach(t => {
      const key = t.icon || '📦';
      if (!categories[key]) {
        categories[key] = { name: t.description || 'Outros', value: 0, icon: key };
      }
      categories[key].value += t.amount;
    });

    return Object.values(categories).sort((a, b) => b.value - a.value);
  }, [transactions, view]);

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm mb-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {chartType === 'evolution' ? 'Evolução Financeira' : 'Distribuição de Gastos'}
          </h3>
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
            <button
              onClick={() => setChartType('evolution')}
              className={cn(
                "px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-lg transition-all",
                chartType === 'evolution' ? "bg-white text-ink shadow-sm border border-slate-100" : "text-slate-400"
              )}
            >
              Evolução
            </button>
            <button
              onClick={() => setChartType('distribution')}
              className={cn(
                "px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-lg transition-all",
                chartType === 'distribution' ? "bg-white text-ink shadow-sm border border-slate-100" : "text-slate-400"
              )}
            >
              Gastos
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
            <button
              onClick={() => setView('week')}
              className={cn(
                "px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-lg transition-all",
                view === 'week' ? "bg-white text-ink shadow-sm border border-slate-100" : "text-slate-400"
              )}
            >
              Semana
            </button>
            <button
              onClick={() => setView('month')}
              className={cn(
                "px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-lg transition-all",
                view === 'month' ? "bg-white text-ink shadow-sm border border-slate-100" : "text-slate-400"
              )}
            >
              Mês
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'evolution' ? (
            <AreaChart data={evolutionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
                dy={10}
                interval={view === 'month' ? 4 : 0}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)'
                }}
                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                labelFormatter={(label, payload) => payload[0]?.payload?.fullDate || label}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="var(--color-secondary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                animationDuration={1000}
              />
            </AreaChart>
          ) : (
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationDuration={1000}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)'
                }}
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Gasto']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                content={({ payload }) => (
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
                    {payload?.map((entry: any, index: number) => (
                      <div key={`item-${index}`} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                          {distributionData[index].icon} {distributionData[index].name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
