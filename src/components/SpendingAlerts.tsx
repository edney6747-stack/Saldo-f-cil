import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, TrendingUp, X } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useState, useEffect } from 'react';

interface SpendingAlertsProps {
  currentSpending: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  limits?: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
  topCategory?: {
    icon: string;
    label: string;
    amount: number;
  };
}

export function SpendingAlerts({ currentSpending, limits, topCategory }: SpendingAlertsProps) {
  const [activeAlert, setActiveAlert] = useState<{
    type: 'warning' | 'danger';
    message: string;
    suggestion?: string;
  } | null>(null);

  useEffect(() => {
    if (!limits) return;

    const alerts: typeof activeAlert[] = [];

    // Monthly check
    if (limits.monthly) {
      const ratio = currentSpending.monthly / limits.monthly;
      if (ratio >= 1) {
        alerts.push({
          type: 'danger',
          message: `Limite mensal de ${formatCurrency(limits.monthly)} excedido!`,
          suggestion: topCategory ? `Gastos em ${topCategory.label} (${topCategory.icon}) estão acima da média.` : undefined
        });
      } else if (ratio >= 0.8) {
        alerts.push({
          type: 'warning',
          message: `Você já gastou ${Math.round(ratio * 100)}% da sua meta mensal de ${formatCurrency(limits.monthly)}.`,
          suggestion: topCategory ? `Atenção aos gastos com ${topCategory.label}.` : undefined
        });
      }
    }

    // Weekly check (if no monthly alert or as secondary)
    if (limits.weekly && alerts.length === 0) {
      const ratio = currentSpending.weekly / limits.weekly;
      if (ratio >= 1) {
        alerts.push({
          type: 'danger',
          message: `Limite semanal de ${formatCurrency(limits.weekly)} atingido.`,
        });
      } else if (ratio >= 0.8) {
        alerts.push({
          type: 'warning',
          message: `Gasto semanal em ${Math.round(ratio * 100)}%. Quase no limite!`,
        });
      }
    }

    // Daily check
    if (limits.daily && alerts.length === 0) {
      const ratio = currentSpending.daily / limits.daily;
      if (ratio >= 1) {
        alerts.push({
          type: 'danger',
          message: `Você ultrapassou o limite diário de ${formatCurrency(limits.daily)}.`,
        });
      }
    }

    setActiveAlert(alerts[0] || null);
  }, [currentSpending, limits, topCategory]);

  if (!activeAlert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "mx-4 mb-6 p-4 rounded-2xl border flex items-start gap-3 shadow-sm relative overflow-hidden",
          activeAlert.type === 'danger' 
            ? "bg-alert/10 border-alert/20 text-ink" 
            : "bg-orange-50 border-orange-100 text-ink"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          activeAlert.type === 'danger' ? "bg-alert/20 text-alert" : "bg-orange-200 text-orange-600"
        )}>
          <AlertCircle size={18} />
        </div>
        
        <div className="flex-1 pr-6">
          <p className="text-xs font-black leading-tight mb-1">
            {activeAlert.message}
          </p>
          {activeAlert.suggestion && (
            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              <TrendingUp size={12} className="text-secondary" />
              <span>{activeAlert.suggestion}</span>
            </div>
          )}
        </div>

        <button 
          onClick={() => setActiveAlert(null)}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600"
        >
          <X size={14} />
        </button>

        {/* Subtle background pulse for danger */}
        {activeAlert.type === 'danger' && (
          <motion.div 
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-alert pointer-events-none"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
