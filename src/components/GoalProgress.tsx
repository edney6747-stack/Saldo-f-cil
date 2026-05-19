import { Goal } from '../types';
import { formatCurrency } from '../lib/utils';

interface GoalProgressProps {
  goal: Goal;
}

export function GoalProgress({ goal }: GoalProgressProps) {
  const percentage = Math.min(Math.round((goal.current / goal.target) * 100), 100);

  return (
    <div className="bg-white border border-secondary/20 p-6 rounded-3xl shadow-sm mb-8">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
            Meta: {goal.label}
          </h3>
          <p className="text-xl font-black text-ink">
            {formatCurrency(goal.current)} <span className="text-slate-300 text-sm font-bold">/ {formatCurrency(goal.target)}</span>
          </p>
        </div>
        <span className="text-2xl font-black text-secondary">{percentage}%</span>
      </div>
      
      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
