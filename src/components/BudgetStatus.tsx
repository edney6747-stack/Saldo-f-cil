import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Budget } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface BudgetStatusProps {
  budgets: Budget[];
  spentByCategory: Record<string, number>;
}

export function BudgetStatus({ budgets, spentByCategory }: BudgetStatusProps) {
  if (budgets.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-lg font-bold text-ink">Orçamentos Mensais</h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Controle de Gastos</span>
      </div>

      <div className="grid gap-3">
        {budgets.map((budget) => {
          const spent = spentByCategory[budget.categoryIcon] || 0;
          const percentage = Math.min(Math.round((spent / budget.limit) * 100), 100);
          const isOver = spent > budget.limit;
          const isNear = spent > budget.limit * 0.8 && !isOver;

          return (
            <motion.div
              key={budget.categoryIcon}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-white p-4 rounded-3xl border transition-all shadow-sm",
                isOver ? "border-alert/30 bg-alert/5" : isNear ? "border-orange-200 bg-orange-50/30" : "border-slate-100"
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{budget.categoryIcon}</div>
                  <div>
                    <p className="text-sm font-bold text-ink">{budget.categoryLabel}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {formatCurrency(spent)} de {formatCurrency(budget.limit)}
                    </p>
                  </div>
                </div>
                {isOver ? (
                  <div className="flex items-center gap-1 text-alert">
                    <AlertTriangle size={14} />
                    <span className="text-[10px] font-black uppercase">Excedido</span>
                  </div>
                ) : isNear ? (
                  <div className="flex items-center gap-1 text-orange-500">
                    <AlertTriangle size={14} />
                    <span className="text-[10px] font-black uppercase">Próximo</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-income">
                    <CheckCircle2 size={14} />
                    <span className="text-[10px] font-black uppercase">No Limite</span>
                  </div>
                )}
              </div>

              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isOver ? "bg-alert" : isNear ? "bg-orange-400" : "bg-income"
                  )}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
