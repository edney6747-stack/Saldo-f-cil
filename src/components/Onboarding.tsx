import { useState } from 'react';
import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (initialBalance: number, userName: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [balance, setBalance] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(balance.replace(',', '.'));
    onComplete(isNaN(num) ? 0 : num, name.trim());
  };

  return (
    <div className="fixed inset-0 bg-surface z-[100] flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xs w-full py-12"
      >
        <div className="w-20 h-20 bg-income rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-income/20">
          <div className="w-10 h-2 bg-white rounded-full" />
        </div>
        
        <h1 className="text-3xl font-black text-ink mb-4 tracking-tight">
          Olá! Bem-vindo ao Saldo Fácil
        </h1>
        <p className="text-slate-500 font-medium mb-12">
          Vamos personalizar sua experiência. Como podemos te chamar?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Seu Nome (Opcional)</label>
            <input
              type="text"
              placeholder="Ex: Bernardo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-none rounded-3xl py-5 px-8 text-xl font-bold text-ink shadow-xl shadow-slate-200 focus:ring-2 focus:ring-secondary/30 transition-all"
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Saldo Atual</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="0,00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full bg-white border-none rounded-3xl py-6 pl-16 pr-8 text-4xl font-black text-ink shadow-xl shadow-slate-200 focus:ring-2 focus:ring-secondary/30 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-income text-ink py-6 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-income/20 active:scale-95 transition-all"
          >
            <Check size={24} />
            Começar Agora
          </button>
        </form>
      </motion.div>
    </div>
  );
}
