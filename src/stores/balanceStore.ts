import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction } from '../types';
import { generateId } from '../utils/id';
import { WELCOME_BONUS, FREE_REFILL_AMOUNT, FREE_REFILL_THRESHOLD } from '../constants/balance';
import { MAX_TRANSACTIONS } from '../constants/rewards';

interface BalanceState {
  balance: number;
  transactions: Transaction[];
  welcomeClaimed: boolean;
  addCredits: (amount: number, reason: string) => void;
  deductCredits: (amount: number) => boolean;
  claimWelcomeBonus: () => number;
  freeRefill: () => number | null;
  canFreeRefill: () => boolean;
}

const BALANCE_STORE_VERSION = 2;

function migrateBalanceState(persisted: unknown): Partial<BalanceState> {
  if (!persisted || typeof persisted !== 'object') return {};
  const state = persisted as Partial<BalanceState>;
  const balance = typeof state.balance === 'number' && Number.isFinite(state.balance) && state.balance >= 0
    ? state.balance
    : 0;
  const transactions = Array.isArray(state.transactions)
    ? state.transactions.filter((transaction) => (
      transaction &&
      typeof transaction.id === 'string' &&
      typeof transaction.amount === 'number' &&
      Number.isFinite(transaction.amount) &&
      typeof transaction.reason === 'string' &&
      typeof transaction.timestamp === 'number' &&
      Number.isFinite(transaction.timestamp) &&
      (transaction.type === 'credit' || transaction.type === 'debit')
    ))
    : [];

  return {
    balance,
    transactions,
    welcomeClaimed: state.welcomeClaimed === true,
  };
}

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set, get) => ({
      balance: 0,
      transactions: [],
      welcomeClaimed: false,

      addCredits: (amount, reason) => {
        if (!Number.isFinite(amount) || amount <= 0) return;
        set((state) => ({
          balance: state.balance + amount,
          transactions: [
            { id: generateId(), amount, reason, timestamp: Date.now(), type: 'credit' as const },
            ...state.transactions,
          ].slice(0, MAX_TRANSACTIONS),
        }));
      },

      deductCredits: (amount) => {
        if (!Number.isSafeInteger(amount) || amount <= 0) return false;
        const { balance } = get();
        if (balance < amount) return false;
        set((state) => ({
          balance: state.balance - amount,
          transactions: [
            { id: generateId(), amount: -amount, reason: 'Bet', timestamp: Date.now(), type: 'debit' as const },
            ...state.transactions,
          ].slice(0, MAX_TRANSACTIONS),
        }));
        return true;
      },

      claimWelcomeBonus: () => {
        const { welcomeClaimed } = get();
        if (welcomeClaimed) return 0;
        set({ welcomeClaimed: true });
        get().addCredits(WELCOME_BONUS, 'Welcome bonus');
        return WELCOME_BONUS;
      },

      freeRefill: () => {
        const { balance } = get();
        if (balance >= FREE_REFILL_THRESHOLD) return null;
        get().addCredits(FREE_REFILL_AMOUNT, 'Free refill');
        return FREE_REFILL_AMOUNT;
      },

      canFreeRefill: () => {
        return get().balance < FREE_REFILL_THRESHOLD;
      },
    }),
    {
      name: 'dopamix_balance',
      version: BALANCE_STORE_VERSION,
      migrate: (persisted: unknown) => migrateBalanceState(persisted),
    }
  )
);
