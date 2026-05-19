import { Settings, RefreshCcw, Download, PieChart, User, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onReset: () => void;
  onExport: () => void;
  onOpenBudgets: () => void;
  onOpenCategories: () => void;
  onOpenNameModal: () => void;
  onOpenSales: () => void;
}

export function Header({ onReset, onExport, onOpenBudgets, onOpenCategories, onOpenNameModal, onOpenSales }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <header className="flex justify-between items-center py-8 px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-income rounded-xl flex items-center justify-center shadow-lg shadow-income/20">
          <PieChart size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-black text-ink tracking-tight leading-none">
            Saldo Fácil
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Organização sem estresse
          </p>
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500 active:scale-90 transition-all hover:border-slate-300"
        >
          <Settings size={20} />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsMenuOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-20"
              >
                <button
                  onClick={() => {
                    onOpenSales();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-sm font-bold text-secondary hover:bg-secondary/5 rounded-xl transition-colors"
                >
                  <Sparkles size={18} className="text-secondary" />
                  Oferta Especial
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2" />
                <button
                  onClick={() => {
                    onOpenNameModal();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <User size={18} className="text-secondary" />
                  Editar Nome
                </button>
                <button
                  onClick={() => {
                    onOpenBudgets();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <PieChart size={18} className="text-secondary" />
                  Orçamentos Mensais
                </button>
                <button
                  onClick={() => {
                    // This will be passed as a new prop
                    onOpenCategories();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Settings size={18} className="text-secondary" />
                  Personalizar Categorias
                </button>
                <button
                  onClick={() => {
                    onExport();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Download size={18} className="text-slate-400" />
                  Exportar Histórico
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2" />
                <button
                  onClick={() => {
                    setShowConfirmReset(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-sm font-bold text-alert hover:bg-alert/5 rounded-xl transition-colors"
                >
                  <RefreshCcw size={18} className="text-alert/60" />
                  Resetar Dados
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showConfirmReset && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                onClick={() => setShowConfirmReset(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xs bg-white rounded-[32px] p-8 z-[70] shadow-2xl text-center"
              >
                <div className="w-16 h-16 bg-expense/10 text-expense rounded-full flex items-center justify-center mx-auto mb-6">
                  <RefreshCcw size={32} />
                </div>
                <h3 className="text-xl font-black text-ink mb-2">Resetar tudo?</h3>
                <p className="text-slate-500 text-sm mb-8">
                  Isso apagará permanentemente todo o seu histórico e saldo.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      onReset();
                      setShowConfirmReset(false);
                    }}
                    className="w-full py-4 bg-alert text-white rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-alert/20"
                  >
                    Sim, apagar tudo
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold active:scale-95 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
