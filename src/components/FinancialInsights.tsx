import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Lightbulb, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { Transaction } from '../types';
import { subDays, isWithinInterval, startOfMonth, endOfMonth, subMonths, isSameDay } from 'date-fns';
import { formatCurrency } from '../lib/utils';

interface FinancialInsightsProps {
  transactions: Transaction[];
}

export function FinancialInsights({ transactions }: FinancialInsightsProps) {
  const insights = useMemo(() => {
    const now = new Date();
    const last7Days = { start: subDays(now, 6), end: now };
    const currentMonth = { start: startOfMonth(now), end: now };
    const lastMonth = { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) };

    const recentTransactions = transactions.filter(t => isWithinInterval(new Date(t.date), last7Days));
    const currentMonthTransactions = transactions.filter(t => isWithinInterval(new Date(t.date), currentMonth));
    const lastMonthTransactions = transactions.filter(t => isWithinInterval(new Date(t.date), lastMonth));

    const list: { icon: any; text: string; type: 'info' | 'success' | 'warning' }[] = [];

    // 1. Positive balance days in last 7 days
    let positiveDays = 0;
    for (let i = 0; i < 7; i++) {
      const day = subDays(now, i);
      const dayT = transactions.filter(t => isSameDay(new Date(t.date), day));
      const income = dayT.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expense = dayT.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      if (income >= expense && dayT.length > 0) positiveDays++;
    }
    if (positiveDays > 0) {
      list.push({
        icon: Calendar,
        text: `Seu saldo ficou positivo em ${positiveDays} dos últimos 7 dias.`,
        type: 'success'
      });
    }

    // 2. Category comparison
    const categories: Record<string, number> = {};
    recentTransactions.filter(t => t.type === 'expense').forEach(t => {
      const label = t.description || 'Outros';
      categories[label] = (categories[label] || 0) + t.amount;
    });

    const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    if (sortedCats.length >= 2) {
      list.push({
        icon: Lightbulb,
        text: `Você gastou mais em ${sortedCats[0][0].toLowerCase()} do que em ${sortedCats[1][0].toLowerCase()} esta semana.`,
        type: 'info'
      });
    }

    // 3. Month over month comparison
    const currentMonthExpense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const lastMonthExpense = lastMonthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    if (lastMonthExpense > 0) {
      const diff = ((lastMonthExpense - currentMonthExpense) / lastMonthExpense) * 100;
      if (diff > 0) {
        list.push({
          icon: TrendingUp,
          text: `Você economizou ${Math.round(diff)}% a mais que no mês passado!`,
          type: 'success'
        });
      } else if (diff < -10) {
        list.push({
          icon: TrendingUp,
          text: `Seus gastos subiram ${Math.round(Math.abs(diff))}% em relação ao mês anterior.`,
          type: 'warning'
        });
      }
    }

    // 4. Projection
    const daysPassed = now.getDate();
    const daysInMonth = endOfMonth(now).getDate();
    if (daysPassed > 5 && currentMonthExpense > 0) {
      const projected = (currentMonthExpense / daysPassed) * daysInMonth;
      const dailyAvg = currentMonthExpense / daysPassed;
      if (dailyAvg < 50) {
        list.push({
          icon: ArrowRight,
          text: `Se mantiver esse ritmo, seus gastos mensais serão de aprox. ${formatCurrency(projected)}.`,
          type: 'info'
        });
      }
    }

    return list.slice(0, 2); // Show top 2 insights
  }, [transactions]);

  if (insights.length === 0) return null;

  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assistente de Consciência</h3>
        <div className="h-[1px] flex-1 bg-slate-100 ml-4"></div>
      </div>
      <div className="grid gap-3">
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-start gap-3"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
              insight.type === 'success' ? 'bg-income/10 text-income' : 
              insight.type === 'warning' ? 'bg-alert/10 text-alert' : 
              'bg-secondary/10 text-secondary'
            }`}>
              <insight.icon size={16} />
            </div>
            <p className="text-sm font-bold text-ink leading-tight pt-1">
              {insight.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
