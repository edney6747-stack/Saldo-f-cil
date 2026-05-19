export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  icon?: string;
  type: TransactionType;
  date: string; // ISO string
}

export interface Shortcut {
  id: string;
  label: string;
  amount?: number;
  icon: string;
  type: TransactionType;
}

export interface Goal {
  target: number;
  current: number;
  label: string;
}

export interface Budget {
  categoryIcon: string;
  categoryLabel: string;
  limit: number;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface AppSettings {
  initialBalance: number;
  hasCompletedOnboarding: boolean;
  userName?: string;
  goal?: Goal;
  budgets?: Budget[];
  spendingLimits?: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
  customCategories?: Category[];
}

export type Period = 'today' | 'week' | 'month' | 'all';
