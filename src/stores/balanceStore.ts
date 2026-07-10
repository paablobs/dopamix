import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction } from '../types';
import { generateId } from '../utils/id';
import { WELCOME_BONUS, FREE_REFILL_AMOUNT, FREE_REFILL_THRESHOLD, STREAK_BONUSES } from '../constants/balance';
import { MAX_TRANSACTIONS } from '../constants/rewards';

interface BalanceState {
  balance: number;
  transactions: Transaction[];
  welcomeClaimed: boolean;
  lastDailyClaim: number | null;
  dailyStreak: number;
  addCredits: (amount: number, reason: string) => void;
  deductCredits: (amount: number) => boolean;
  claimWelcomeBonus: () => number;
  claimDailyBonus: () => number | null;
  freeRefill: () => number | null;
  canClaimDaily: () => boolean;
  canFreeRefill: () => boolean;
}

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set, get) => ({
      balance: 0,
      transactions: [],
      welcomeClaimed: false,
      lastDailyClaim: null,
      dailyStreak: 0,

      addCredits: (amount, reason) => {
        set((state) => ({
          balance: state.balance + amount,
          transactions: [
            { id: generateId(), amount, reason, timestamp: Date.now(), type: 'credit' as const },
            ...state.transactions,
          ].slice(0, MAX_TRANSACTIONS),
        }));
      },

      deductCredits: (amount) => {
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

      claimDailyBonus: () => {
        const { lastDailyClaim, dailyStreak } = get();
        const now = Date.now();
        if (lastDailyClaim && now - lastDailyClaim < 86400000) return null;

        const newStreak = lastDailyClaim && now - lastDailyClaim < 172800000
          ? dailyStreak + 1
          : 1;

        const bonusIndex = Math.min(newStreak, STREAK_BONUSES.length) - 1;
        const amount = STREAK_BONUSES[bonusIndex];

        set({ lastDailyClaim: now, dailyStreak: newStreak });
        get().addCredits(amount, `Daily bonus (day ${newStreak})`);
        return amount;
      },

      freeRefill: () => {
        const { balance } = get();
        if (balance >= FREE_REFILL_THRESHOLD) return null;
        get().addCredits(FREE_REFILL_AMOUNT, 'Free refill');
        return FREE_REFILL_AMOUNT;
      },

      canClaimDaily: () => {
        const { lastDailyClaim } = get();
        if (!lastDailyClaim) return true;
        return Date.now() - lastDailyClaim >= 86400000;
      },

      canFreeRefill: () => {
        return get().balance < FREE_REFILL_THRESHOLD;
      },
    }),
    { name: 'dopamix_balance' }
  )
);
