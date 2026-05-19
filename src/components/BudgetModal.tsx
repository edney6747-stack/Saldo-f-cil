import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Save, Calculator as CalcIcon } from 'lucide-react';
import { Budget, Category } from '../types';
import { cn } from '../lib/utils';
import { Calculator } from './Calculator';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgets: Budget[];
  categories: Category[];
  spendingLimits?: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
  onSave: (budgets: Budget[], spendingLimits: { daily?: number; weekly?: number; monthly?: number }) => void;
}

export function BudgetModal({ isOpen, onClose, budgets, categories, spendingLimits, onSave }: BudgetModalProps) {
  const [localBudgets, setLocalBudgets] = useState<Budget[]>([]);
  const [localLimits, setLocalLimits] = useState({
    daily: '',
    weekly: '',
    monthly: ''
  });
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || { icon: '📦', label: 'Geral' });
  const [limit, setLimit] = useState('');
  const [calcTarget, setCalcTarget] = useState<'limit' | 'daily' | 'weekly' | 'monthly' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalBudgets([...budgets]);
      setLocalLimits({
        daily: spendingLimits?.daily?.toString() || '',
        weekly: spendingLimits?.weekly?.toString() || '',
        monthly: spendingLimits?.monthly?.toString() || ''
      });
      if (categories.length > 0) setSelectedCategory(categories[0]);
    }
  }, [isOpen, budgets, spendingLimits, categories]);

  const handleAddBudget = () => {
    const numLimit = parseFloat(limit);
    if (isNaN(numLimit) || numLimit <= 0) return;

    // Check if category already has a budget
    const existingIndex = localBudgets.findIndex(b => b.categoryIcon === selectedCategory.icon);
    
    if (existingIndex >= 0) {
      const updated = [...localBudgets];
      updated[existingIndex] = { ...selectedCategory, categoryIcon: selectedCategory.icon, categoryLabel: selectedCategory.label, limit: numLimit };
      setLocalBudgets(updated);
    } else {
      setLocalBudgets([...localBudgets, { categoryIcon: selectedCategory.icon, categoryLabel: selectedCategory.label, limit: numLimit }]);
    }
    setLimit('');
  };

  const handleRemoveBudget = (icon: string) => {
    setLocalBudgets(localBudgets.filter(b => b.categoryIcon !== icon));
  };

  const handleSave = () => {
    onSave(localBudgets, {
      daily: localLimits.daily ? parseFloat(localLimits.daily) : undefined,
      weekly: localLimits.weekly ? parseFloat(localLimits.weekly) : undefined,
      monthly: localLimits.monthly ? parseFloat(localLimits.monthly) : undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-[32px] p-8 z-[90] shadow-2xl max-w-lg mx-auto max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-ink">Configurar Orçamentos</h2>
              <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 shadow-sm">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Novo Orçamento</label>
                
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all",
                        selectedCategory.icon === cat.icon ? "bg-secondary/20 scale-110 border-2 border-secondary/30" : "bg-slate-50 border border-slate-100"
                      )}
                    >
                      {cat.icon}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">R$</span>
                    <input
                      type="number"
                      placeholder="Limite mensal"
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-10 pr-12 font-bold text-ink outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                    <button
                      type="button"
                      onClick={() => setCalcTarget('limit')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-secondary hover:bg-secondary/5 rounded-lg transition-all"
                    >
                      <CalcIcon size={18} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddBudget}
                    className="bg-secondary text-white p-4 rounded-2xl shadow-lg shadow-secondary/20 active:scale-95 transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'daily', label: 'Limite Diário' },
                    { id: 'weekly', label: 'Limite Semanal' },
                    { id: 'monthly', label: 'Limite Mensal' }
                  ].map(field => (
                    <div key={field.id}>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">{field.label}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">R$</span>
                        <input
                          type="number"
                          placeholder="Não definido"
                          value={localLimits[field.id as keyof typeof localLimits]}
                          onChange={(e) => setLocalLimits({ ...localLimits, [field.id]: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-10 pr-12 font-bold text-ink outline-none focus:ring-2 focus:ring-secondary/30"
                        />
                        <button
                          type="button"
                          onClick={() => setCalcTarget(field.id as any)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-secondary hover:bg-secondary/5 rounded-lg transition-all"
                        >
                          <CalcIcon size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Orçamentos Ativos</label>
                {localBudgets.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm italic">Nenhum orçamento definido.</p>
                ) : (
                  localBudgets.map(budget => (
                    <div key={budget.categoryIcon} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{budget.categoryIcon}</span>
                        <div>
                          <p className="text-sm font-bold text-ink">{budget.categoryLabel}</p>
                          <p className="text-xs font-bold text-secondary">Limite: R$ {budget.limit}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveBudget(budget.categoryIcon)}
                        className="p-2 text-alert hover:bg-alert/5 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-ink text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-ink/20 active:scale-95 transition-all mt-8"
              >
                <Save size={20} />
                Salvar Configurações
              </button>
            </div>

            <Calculator 
              isOpen={!!calcTarget}
              onClose={() => setCalcTarget(null)}
              onApply={(val) => {
                if (calcTarget === 'limit') setLimit(val);
                else if (calcTarget) setLocalLimits({ ...localLimits, [calcTarget]: val });
              }}
              initialValue={
                calcTarget === 'limit' 
                  ? limit 
                  : calcTarget 
                    ? localLimits[calcTarget as keyof typeof localLimits] 
                    : ''
              }
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
