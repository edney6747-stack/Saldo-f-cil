/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Plus, Minus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { isToday, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

import { Transaction, TransactionType, Period, Shortcut, AppSettings } from './types';
import { storage } from './lib/storage';
import { Header } from './components/Header';
import { BalanceDisplay } from './components/BalanceDisplay';
import { TransactionModal } from './components/TransactionModal';
import { TransactionList } from './components/TransactionList';
import { PeriodFilters } from './components/PeriodFilters';
import { QuickShortcuts } from './components/QuickShortcuts';
import { GoalProgress } from './components/GoalProgress';
import { Onboarding } from './components/Onboarding';
import { FinancialChart } from './components/FinancialChart';
import { FinancialInsights } from './components/FinancialInsights';
import { MonthlySummary } from './components/MonthlySummary';
import { BudgetStatus } from './components/BudgetStatus';
import { BudgetModal } from './components/BudgetModal';
import { CategoryModal } from './components/CategoryModal';
import { NameModal } from './components/NameModal';
import { SalesPage } from './components/SalesPage';
import { CategoryPieChart } from './components/CategoryPieChart';
import { useRipple, RippleContainer } from './components/Ripple';
import { DEFAULT_CATEGORIES } from './constants';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [period, setPeriod] = useState<Period>('all');
  const [modalType, setModalType] = useState<TransactionType | null>(null);
  const [modalInitialValues, setModalInitialValues] = useState<{ description: string; icon: string } | null>(null);
  const [lastChangeType, setLastChangeType] = useState<'income' | 'expense' | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isSalesPageOpen, setIsSalesPageOpen] = useState(true);

  const { ripples: incomeRipples, addRipple: addIncomeRipple, setRipples: setIncomeRipples } = useRipple();
  const { ripples: expenseRipples, addRipple: addExpenseRipple, setRipples: setExpenseRipples } = useRipple();

  const allCategories = useMemo(() => {
    return [...DEFAULT_CATEGORIES, ...(settings.customCategories || [])];
  }, [settings.customCategories]);

  // Load initial data
  useEffect(() => {
    setTransactions(storage.getTransactions());
    setShortcuts(storage.getShortcuts());
  }, []);

  const balance = useMemo(() => {
    const transBalance = transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
    return transBalance + settings.initialBalance;
  }, [transactions, settings.initialBalance]);

  const dailySpent = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && isToday(new Date(t.date)))
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const monthlySummary = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    
    const monthlyTrans = transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start, end })
    );

    const income = monthlyTrans
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = monthlyTrans
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return { income, expense };
  }, [transactions]);

  const compactTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  const spentByCategory = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    
    const monthlyExpenses = transactions.filter(t => 
      t.type === 'expense' && 
      isWithinInterval(new Date(t.date), { start, end })
    );

    const spent: Record<string, number> = {};
    monthlyExpenses.forEach(t => {
      if (t.icon) {
        spent[t.icon] = (spent[t.icon] || 0) + t.amount;
      }
    });
    return spent;
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      const date = new Date(t.date);
      if (period === 'today') return isToday(date);
      if (period === 'week') {
        return isWithinInterval(date, {
          start: startOfWeek(now, { weekStartsOn: 0 }),
          end: endOfWeek(now, { weekStartsOn: 0 }),
        });
      }
      if (period === 'month') {
        return isWithinInterval(date, {
          start: startOfMonth(now),
          end: endOfMonth(now),
        });
      }
      return true;
    });
  }, [transactions, period]);

  const suggestion = useMemo(() => {
    if (transactions.length < 3) return null;
    const counts: Record<string, number> = {};
    transactions.slice(0, 10).forEach(t => {
      const key = `${t.type}-${t.amount}-${t.description}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] >= 2) {
      const [type, amount, desc] = top[0].split('-');
      return { type: type as TransactionType, amount: parseFloat(amount), description: desc };
    }
    return null;
  }, [transactions]);

  const handleAddTransaction = (amount: number, description: string, icon?: string) => {
    const type = modalType || (suggestion?.type as TransactionType) || 'income';
    
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount,
      description,
      icon,
      type,
      date: new Date().toISOString(),
    };

    const updated = storage.addTransaction(newTransaction);
    setTransactions(updated);
    setLastChangeType(type);
    setTimeout(() => setLastChangeType(null), 1000);
  };

  const handleUseShortcut = (shortcut: Shortcut) => {
    if (shortcut.amount) {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        amount: shortcut.amount,
        description: shortcut.label,
        icon: shortcut.icon,
        type: shortcut.type,
        date: new Date().toISOString(),
      };

      const updated = storage.addTransaction(newTransaction);
      setTransactions(updated);
      setLastChangeType(shortcut.type);
      setTimeout(() => setLastChangeType(null), 1000);
    } else {
      setModalInitialValues({ description: shortcut.label, icon: shortcut.icon });
      setModalType(shortcut.type);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = storage.deleteTransaction(id);
    setTransactions(updated);
  };

  const handleReset = () => {
    storage.reset();
    setTransactions([]);
    setSettings(storage.getSettings());
  };

  const handleOnboardingComplete = (initialBalance: number, userName: string) => {
    const newSettings = { ...settings, initialBalance, userName, hasCompletedOnboarding: true };
    storage.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSaveBudgets = (budgets: any[]) => {
    const newSettings = { ...settings, budgets };
    storage.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSaveCategories = (customCategories: any[]) => {
    const newSettings = { ...settings, customCategories };
    storage.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSaveName = (userName: string) => {
    const newSettings = { ...settings, userName };
    storage.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleExport = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Saldo Fácil - Histórico Financeiro', 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      if (settings.userName) {
        doc.text(`Usuário: ${settings.userName}`, 14, 30);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 37);
        doc.text(`Saldo Total: R$ ${balance.toFixed(2)}`, 14, 44);
      } else {
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);
        doc.text(`Saldo Total: R$ ${balance.toFixed(2)}`, 14, 37);
      }

      const tableColumn = ["Data", "Tipo", "Descrição", "Valor"];
      const tableRows = transactions.map(t => [
        new Date(t.date).toLocaleDateString('pt-BR'),
        t.type === 'income' ? 'Entrada' : 'Saída',
        t.description || '-',
        `R$ ${t.amount.toFixed(2)}`
      ]);

      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: settings.userName ? 52 : 45,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
        alternateRowStyles: { fillColor: [248, 250, 252] }
      } as UserOptions);

      doc.save(`saldo_facil_export_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF, falling back to CSV', error);
      // Fallback to CSV
      const headers = ['Data', 'Tipo', 'Descrição', 'Valor'];
      if (settings.userName) headers.unshift('Usuário');
      
      const rows = transactions.map(t => {
        const row = [
          new Date(t.date).toLocaleDateString('pt-BR'),
          t.type === 'income' ? 'Entrada' : 'Saída',
          t.description || '-',
          t.amount.toFixed(2)
        ];
        if (settings.userName) row.unshift(settings.userName);
        return row;
      });
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', `saldo_facil_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
    }
  };

  if (!settings.hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-surface flex flex-col">
      <Header 
        onReset={handleReset} 
        onExport={handleExport} 
        onOpenBudgets={() => setIsBudgetModalOpen(true)}
        onOpenCategories={() => setIsCategoryModalOpen(true)}
        onOpenNameModal={() => setIsNameModalOpen(true)}
        onOpenSales={() => setIsSalesPageOpen(true)}
      />

      <main className="flex-1 px-4 overflow-y-auto pb-12">
        <BalanceDisplay 
          balance={balance} 
          dailySpent={dailySpent} 
          lastChangeType={lastChangeType}
          userName={settings.userName}
        />

        <FinancialChart transactions={transactions} />

        <CategoryPieChart 
          spentByCategory={spentByCategory} 
          categories={allCategories} 
        />

        <FinancialInsights transactions={transactions} />

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={(e) => {
              addIncomeRipple(e);
              setModalType('income');
            }}
            className="btn-primary bg-income text-ink shadow-lg shadow-income/20 relative overflow-hidden"
          >
            <RippleContainer 
              ripples={incomeRipples} 
              onAnimationComplete={(id) => setIncomeRipples(prev => prev.filter(r => r.id !== id))} 
              color="rgba(255, 255, 255, 0.4)"
            />
            <Plus size={20} />
            Entrada
          </button>
          <button
            onClick={(e) => {
              addExpenseRipple(e);
              setModalType('expense');
            }}
            className="btn-primary bg-expense text-ink shadow-lg shadow-expense/20 relative overflow-hidden"
          >
            <RippleContainer 
              ripples={expenseRipples} 
              onAnimationComplete={(id) => setExpenseRipples(prev => prev.filter(r => r.id !== id))} 
              color="rgba(255, 255, 255, 0.4)"
            />
            <Minus size={20} />
            Saída
          </button>
        </div>

        <MonthlySummary 
          income={monthlySummary.income} 
          expense={monthlySummary.expense} 
        />

        <BudgetStatus 
          budgets={settings.budgets || []} 
          spentByCategory={spentByCategory} 
        />

        {suggestion && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-accent text-white p-4 rounded-3xl mb-8 flex items-center justify-between shadow-xl shadow-accent/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Sugestão</p>
                <p className="text-sm font-bold">Registrar {suggestion.description}?</p>
              </div>
            </div>
            <button 
              onClick={() => handleAddTransaction(suggestion.amount, suggestion.description)}
              className="bg-white text-accent px-4 py-2 rounded-xl text-xs font-black active:scale-95 transition-all"
            >
              R$ {suggestion.amount}
            </button>
          </motion.div>
        )}

        <QuickShortcuts shortcuts={shortcuts} onUse={handleUseShortcut} />

        {settings.goal && <GoalProgress goal={settings.goal} />}

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-ink">Histórico Recente</h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Últimos registros
            </span>
          </div>
          
          <TransactionList 
            transactions={compactTransactions} 
            onDelete={handleDeleteTransaction} 
          />
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-ink">Filtros</h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {filteredTransactions.length} totais
              </span>
            </div>
            <PeriodFilters current={period} onChange={setPeriod} />
            <TransactionList 
              transactions={filteredTransactions} 
              onDelete={handleDeleteTransaction} 
            />
          </div>
        </div>
      </main>

      <TransactionModal
        isOpen={!!modalType}
        onClose={() => {
          setModalType(null);
          setModalInitialValues(null);
        }}
        onSave={handleAddTransaction}
        type={modalType || 'income'}
        initialDescription={modalInitialValues?.description}
        initialIcon={modalInitialValues?.icon}
        categories={allCategories}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budgets={settings.budgets || []}
        categories={allCategories}
        spendingLimits={settings.spendingLimits}
        onSave={handleSaveBudgets}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        customCategories={settings.customCategories || []}
        onSave={handleSaveCategories}
      />

      <NameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        currentName={settings.userName || ''}
        onSave={handleSaveName}
      />

      {isSalesPageOpen && (
        <SalesPage onClose={() => setIsSalesPageOpen(false)} isInitial={true} />
      )}

      {/* Floating Offer Button */}
      {!isSalesPageOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSalesPageOpen(true)}
          className="fixed bottom-6 right-6 bg-secondary text-white p-4 rounded-full shadow-2xl shadow-secondary/40 z-50 flex items-center gap-2 font-black text-xs uppercase tracking-widest"
        >
          <Sparkles size={20} />
          <span>Oferta</span>
        </motion.button>
      )}

      {/* Soft Footer */}
      <div className="p-12 text-center border-t border-secondary/10 bg-white/30">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
          Saldo Fácil • Organização sem estresse
        </p>
      </div>
    </div>
  );
}
