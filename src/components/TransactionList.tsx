import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Hoje';
    if (isYesterday(date)) return 'Ontem';
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <ArrowUpRight size={32} />
        </div>
        <p className="text-slate-400 font-medium">Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <AnimatePresence initial={false}>
        {transactions.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="group relative flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-colors",
                t.type === 'income' ? "bg-income/30 text-ink" : "bg-expense/30 text-ink"
              )}>
                {t.icon ? (
                  <div className="relative">
                    <span className="grayscale-0">{t.icon}</span>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center",
                      t.type === 'income' ? "bg-income" : "bg-expense"
                    )}>
                      {t.type === 'income' ? <ArrowUpRight size={8} className="text-white" /> : <ArrowDownLeft size={8} className="text-white" />}
                    </div>
                  </div>
                ) : (
                  t.type === 'income' ? <ArrowUpRight size={20} className="text-ink/60" /> : <ArrowDownLeft size={20} className="text-ink/60" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-ink text-sm leading-tight">
                  {t.description || (t.type === 'income' ? 'Entrada' : 'Saída')}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {formatDate(t.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-sm font-black ${
                t.type === 'income' ? 'text-ink' : 'text-alert'
              }`}>
                {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
              </span>
              
              <button
                onClick={() => onDelete(t.id)}
                className="p-2 text-slate-300 hover:text-expense transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
