import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { Category } from '../types';
import { EMOJI_LIST } from '../constants';
import { cn } from '../lib/utils';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customCategories: Category[];
  onSave: (categories: Category[]) => void;
}

export function CategoryModal({ isOpen, onClose, customCategories, onSave }: CategoryModalProps) {
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_LIST[0]);

  useState(() => {
    if (isOpen) {
      setLocalCategories([...customCategories]);
    }
  });

  // Update local state when modal opens
  useState(() => {
    setLocalCategories([...customCategories]);
  });

  const handleAddCategory = () => {
    if (!newLabel.trim()) return;
    
    const newCategory: Category = {
      id: `custom-${Date.now()}`,
      label: newLabel.trim(),
      icon: selectedEmoji
    };

    setLocalCategories([...localCategories, newCategory]);
    setNewLabel('');
  };

  const handleRemoveCategory = (id: string) => {
    setLocalCategories(localCategories.filter(c => c.id !== id));
  };

  const handleSave = () => {
    onSave(localCategories);
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-[32px] p-8 z-[110] shadow-2xl max-w-lg mx-auto max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-ink">Personalizar Categorias</h2>
              <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 shadow-sm">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Nova Categoria</label>
                
                <div className="grid grid-cols-8 gap-2 mb-4 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl no-scrollbar">
                  {EMOJI_LIST.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center text-xl rounded-lg transition-all",
                        selectedEmoji === emoji ? "bg-secondary/20 scale-110" : "hover:bg-slate-200"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Nome da categoria"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-ink outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="bg-secondary text-white p-4 rounded-2xl shadow-lg shadow-secondary/20 active:scale-95 transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Suas Categorias</label>
                {localCategories.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm italic">Nenhuma categoria personalizada.</p>
                ) : (
                  <div className="grid gap-2">
                    {localCategories.map(cat => (
                      <div key={cat.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="text-sm font-bold text-ink">{cat.label}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveCategory(cat.id)}
                          className="p-2 text-alert hover:bg-alert/5 rounded-xl transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-ink text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-ink/20 active:scale-95 transition-all mt-8"
              >
                <Save size={20} />
                Salvar Categorias
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
