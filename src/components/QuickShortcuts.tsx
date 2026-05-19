import { motion } from 'motion/react';
import { Shortcut } from '../types';

interface QuickShortcutsProps {
  shortcuts: Shortcut[];
  onUse: (shortcut: Shortcut) => void;
}

export function QuickShortcuts({ shortcuts, onUse }: QuickShortcutsProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">
        Atalhos Rápidos
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {shortcuts.map((s) => (
          <motion.button
            key={s.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onUse(s)}
            className="flex-shrink-0 flex items-center gap-3 bg-white border border-slate-100 p-3 pr-5 rounded-2xl shadow-sm hover:border-secondary/50 transition-all"
          >
            <span className="text-xl grayscale-0">{s.icon}</span>
            <div className="text-left">
              <p className="text-xs font-bold text-ink leading-tight">{s.label}</p>
              {s.amount ? (
                <p className={`text-[10px] font-bold ${s.type === 'income' ? 'text-ink/60' : 'text-alert/80'}`}>
                  {s.type === 'income' ? '+' : '-'} R$ {s.amount}
                </p>
              ) : (
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Registrar</p>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
