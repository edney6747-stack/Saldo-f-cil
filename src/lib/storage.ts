import { Transaction, Shortcut, AppSettings } from '../types';

const STORAGE_KEY = 'saldo_facil_transactions';
const SHORTCUTS_KEY = 'saldo_facil_shortcuts';
const SETTINGS_KEY = 'saldo_facil_settings';

const DEFAULT_SETTINGS: AppSettings = {
  initialBalance: 0,
  hasCompletedOnboarding: false,
};

const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: '1', label: 'Café', icon: '☕', type: 'expense' },
  { id: '2', label: 'Almoço', icon: '🍱', type: 'expense' },
  { id: '3', label: 'Transporte', icon: '🚗', type: 'expense' },
  { id: '4', label: 'Mercado', icon: '🛒', type: 'expense' },
];

export const storage = {
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse transactions', e);
      return [];
    }
  },

  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },

  addTransaction: (transaction: Transaction) => {
    const transactions = storage.getTransactions();
    const updated = [transaction, ...transactions];
    storage.saveTransactions(updated);
    return updated;
  },

  deleteTransaction: (id: string) => {
    const transactions = storage.getTransactions();
    const updated = transactions.filter(t => t.id !== id);
    storage.saveTransactions(updated);
    return updated;
  },

  getShortcuts: (): Shortcut[] => {
    const data = localStorage.getItem(SHORTCUTS_KEY);
    if (!data) return DEFAULT_SHORTCUTS;
    try {
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_SHORTCUTS;
    }
  },

  saveShortcuts: (shortcuts: Shortcut[]) => {
    localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(shortcuts));
  },

  getSettings: (): AppSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return DEFAULT_SETTINGS;
    try {
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SHORTCUTS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  }
};
