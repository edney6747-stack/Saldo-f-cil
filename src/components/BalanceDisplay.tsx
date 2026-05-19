import { motion, useAnimation } from 'motion/react';
import { useEffect } from 'react';
import { formatCurrency } from '../lib/utils';

interface BalanceDisplayProps {
  balance: number;
  dailySpent: number;
  lastChangeType?: 'income' | 'expense' | null;
  userName?: string;
}

export function BalanceDisplay({ balance, dailySpent, lastChangeType, userName }: BalanceDisplayProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (lastChangeType) {
      controls.start({
        opacity: [1, 0.8, 1],
        scale: [1, 1.02, 1],
        color: lastChangeType === 'income' ? '#98FB98' : '#F08080',
        transition: { duration: 0.5, ease: "easeInOut" }
      }).then(() => {
        controls.start({ color: balance >= 0 ? '#333333' : '#F08080' });
      });
    }
  }, [lastChangeType, balance, controls]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {userName && (
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-bold text-secondary mb-1"
        >
          Olá, {userName}!
        </motion.span>
      )}
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-3">
        Patrimônio Consolidado
      </span>
      <motion.h1 
        animate={controls}
        initial={{ color: balance >= 0 ? '#333333' : '#F08080' }}
        className="text-7xl font-black tracking-tighter mb-6"
      >
        {formatCurrency(balance)}
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/5 px-5 py-2.5 rounded-2xl border border-slate-200/50"
      >
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Despesa Diária: <span className="text-alert">{formatCurrency(dailySpent)}</span>
        </p>
      </motion.div>
    </div>
  );
}
