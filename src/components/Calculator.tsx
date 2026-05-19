import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, X, Divide, Minus, Plus, X as Multiply, Equal } from 'lucide-react';
import { cn } from '../lib/utils';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (value: string) => void;
  initialValue?: string;
}

export function Calculator({ isOpen, onClose, onApply, initialValue = '' }: CalculatorProps) {
  const [display, setDisplay] = useState(initialValue || '0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleEqual = () => {
    if (!equation) return;
    
    const fullEquation = equation + display;
    try {
      // Basic math evaluation (safe for simple calculators)
      // eslint-disable-next-line no-eval
      const result = eval(fullEquation.replace('×', '*').replace('÷', '/'));
      const formattedResult = Number(result.toFixed(2)).toString();
      setDisplay(formattedResult);
      setEquation('');
      setShouldReset(true);
    } catch (e) {
      setDisplay('Erro');
      setEquation('');
    }
  };

  const handleApply = () => {
    onApply(display);
    onClose();
  };

  const Button = ({ children, onClick, className, variant = 'default' }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-14 rounded-2xl font-bold text-lg transition-all active:scale-90 flex items-center justify-center",
        variant === 'default' && "bg-slate-50 text-ink hover:bg-slate-100",
        variant === 'operator' && "bg-secondary/10 text-secondary hover:bg-secondary/20",
        variant === 'action' && "bg-ink text-white hover:bg-ink/90",
        className
      )}
    >
      {children}
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-white rounded-[32px] p-6 z-[110] shadow-2xl border border-slate-100"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculadora</span>
              <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-500">
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 mb-4 text-right overflow-hidden">
              <div className="text-[10px] font-bold text-slate-400 h-4 mb-1 uppercase tracking-tighter">
                {equation}
              </div>
              <div className="text-3xl font-black text-ink truncate">
                {display}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Button onClick={handleClear} className="text-alert">C</Button>
              <Button onClick={handleBackspace}><Delete size={20} /></Button>
              <Button onClick={() => handleOperator('÷')} variant="operator"><Divide size={20} /></Button>
              <Button onClick={() => handleOperator('×')} variant="operator"><Multiply size={20} /></Button>

              <Button onClick={() => handleNumber('7')}>7</Button>
              <Button onClick={() => handleNumber('8')}>8</Button>
              <Button onClick={() => handleNumber('9')}>9</Button>
              <Button onClick={() => handleOperator('-')} variant="operator"><Minus size={20} /></Button>

              <Button onClick={() => handleNumber('4')}>4</Button>
              <Button onClick={() => handleNumber('5')}>5</Button>
              <Button onClick={() => handleNumber('6')}>6</Button>
              <Button onClick={() => handleOperator('+')} variant="operator"><Plus size={20} /></Button>

              <Button onClick={() => handleNumber('1')}>1</Button>
              <Button onClick={() => handleNumber('2')}>2</Button>
              <Button onClick={() => handleNumber('3')}>3</Button>
              <Button onClick={handleEqual} variant="operator" className="bg-secondary text-white hover:bg-secondary/90">
                <Equal size={20} />
              </Button>

              <Button onClick={() => handleNumber('0')} className="col-span-2">0</Button>
              <Button onClick={() => handleNumber('.')}>.</Button>
              <Button onClick={handleApply} variant="action">OK</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
