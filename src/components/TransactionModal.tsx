import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Calculator as CalcIcon } from 'lucide-react';
import { TransactionType, Category } from '../types';
import { cn } from '../lib/utils';
import { Calculator } from './Calculator';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, description: string, icon?: string) => void;
  type: TransactionType;
  initialDescription?: string;
  initialIcon?: string;
  categories: Category[];
}

export function TransactionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  type, 
  initialDescription, 
  initialIcon,
  categories
}: TransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription(initialDescription || '');
      setSelectedIcon(initialIcon || null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialDescription, initialIcon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) return;
    onSave(numAmount, description, selectedIcon || undefined);
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 z-50 shadow-2xl max-w-lg mx-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-ink">
                {type === 'income' ? 'Registrar Entrada' : 'Registrar Saída'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 bg-slate-100/50 rounded-full text-slate-400 active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-300">
                    R$
                  </span>
                  <input
                    ref={inputRef}
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-6 pl-16 pr-16 text-4xl font-black text-ink focus:ring-2 focus:ring-secondary/30 focus:bg-white transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsCalcOpen(true)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-secondary active:scale-90 transition-all"
                  >
                    <CalcIcon size={20} />
                  </button>
                </div>
              </div>

              <Calculator 
                isOpen={isCalcOpen}
                onClose={() => setIsCalcOpen(false)}
                onApply={(val) => setAmount(val)}
                initialValue={amount}
              />

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                  Descrição
                </label>
                <input
                  type="text"
                  placeholder="O que você está registrando?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 text-base font-bold text-ink focus:ring-2 focus:ring-secondary/30 focus:bg-white transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                  Categoria
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedIcon(cat.icon === selectedIcon ? null : cat.icon);
                        if (!description) setDescription(cat.label);
                      }}
                      className={cn(
                        "flex-shrink-0 px-4 h-12 rounded-xl text-xl flex items-center justify-center gap-2 transition-all",
                        selectedIcon === cat.icon ? "bg-secondary/30 scale-105 border-2 border-secondary/20" : "bg-slate-50/50 border border-slate-100 hover:bg-slate-100"
                      )}
                    >
                      <span>{cat.icon}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className={cn(
                  "w-full py-5 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all",
                  type === 'income' ? "bg-income shadow-income/20" : "bg-expense shadow-expense/20"
                )}
              >
                <Check size={24} />
                Confirmar Registro
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
