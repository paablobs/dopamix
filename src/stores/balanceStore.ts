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
    { name: 'dopamix_balance' }
  )
);
