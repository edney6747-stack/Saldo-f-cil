import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../lib/utils';

interface CategoryPieChartProps {
  spentByCategory: Record<string, number>;
  categories: { id: string; name: string; icon: string }[];
}

const COLORS = ['#87CEEB', '#C8A2C8', '#98FB98', '#FFA07A', '#F08080', '#FFD700', '#40E0D0', '#EE82EE'];

export function CategoryPieChart({ spentByCategory, categories }: CategoryPieChartProps) {
  const data = useMemo(() => {
    return Object.entries(spentByCategory)
      .map(([icon, value]) => {
        const category = categories.find(c => c.icon === icon);
        return {
          name: category ? category.name : 'Outros',
          value,
          icon
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [spentByCategory, categories]);

  if (data.length === 0) {
    return (
      <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm mb-8 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Nenhum gasto registrado este mês
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm mb-8">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
        Distribuição de Gastos (Mês Atual)
      </h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={8}
              dataKey="value"
              animationDuration={1000}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '20px', 
                border: 'none', 
                boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                fontSize: '11px',
                fontWeight: 'bold',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(8px)',
                padding: '12px'
              }}
              formatter={(value: number) => [formatCurrency(value), 'Total']}
            />
            <Legend 
              verticalAlign="bottom" 
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-6">
                  {payload?.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                        {data[index].icon} {data[index].name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
