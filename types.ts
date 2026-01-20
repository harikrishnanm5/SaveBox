export interface SavingsPlan {
  title: string;
  steps: string[];
  estimatedTime: string;
  motivationalQuote: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon?: string;
  color?: string;
  plan?: SavingsPlan;
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}