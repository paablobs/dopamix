import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bet, BetSlipItem } from '../types';
import { createBet, calculateXpReward } from '../services/betEngine';
import { useBalanceStore } from './balanceStore';
import { useRewardStore } from './rewardStore';
import { notifyBetWon, notifyBetLost } from '../services/notificationService';
import { MAX_BET_HISTORY } from '../constants/rewards';

interface BetState {
  betSlip: BetSlipItem[];
  activeBets: Bet[];
  betHistory: Bet[];
  addToBetSlip: (item: BetSlipItem) => void;
  removeFromBetSlip: (eventId: string) => void;
  clearBetSlip: () => void;
  placeBet: (stake: number) => boolean;
  tickBets: () => void;
}

export const useBetStore = create<BetState>()(
  persist(
    (set, get) => ({
      betSlip: [],
      activeBets: [],
      betHistory: [],

      addToBetSlip: (item) => {
        set((state) => {
          const exists = state.betSlip.find((b) => b.eventId === item.eventId);
          if (exists) return state;
          return { betSlip: [...state.betSlip, item] };
        });
      },

      removeFromBetSlip: (eventId) => {
        set((state) => ({
          betSlip: state.betSlip.filter((b) => b.eventId !== eventId),
        }));
      },

      clearBetSlip: () => set({ betSlip: [] }),

      placeBet: (stake) => {
        const { betSlip } = get();
        if (betSlip.length === 0) return false;

        const balanceStore = useBalanceStore.getState();
        if (!balanceStore.deductCredits(stake)) return false;

        const selection = betSlip[0];
        const bet = createBet(
          selection.eventId,
          selection.eventSummary,
          selection.selection,
          selection.odds,
          stake
        );

        set((state) => ({
          activeBets: [...state.activeBets, bet],
          betSlip: [],
        }));

        const rewardStore = useRewardStore.getState();
        rewardStore.addXp(10);
        rewardStore.incrementBetCount();
        return true;
      },

      tickBets: () => {
        const now = Date.now();
        const { activeBets } = get();
        const toResolve: Bet[] = [];

        activeBets.forEach((bet) => {
          const elapsed = (now - bet.placedAt) / 1000;
          if (elapsed >= bet.resolutionDelay) {
            toResolve.push(bet);
          }
        });

        if (toResolve.length === 0) return;

        const balanceStore = useBalanceStore.getState();
        const rewardStore = useRewardStore.getState();

        const resolvedBets = toResolve.map((bet) => {
          const won = Math.random() > 0.52;
          const profit = won ? bet.potentialWin - bet.stake : -bet.stake;

          if (won) {
            balanceStore.addCredits(bet.potentialWin, `Won: ${bet.eventSummary}`);
            notifyBetWon(bet.potentialWin);
            rewardStore.recordWin(bet.potentialWin);
          } else {
            notifyBetLost();
            rewardStore.recordLoss();
          }

          const xp = calculateXpReward(bet, won);
          rewardStore.addXp(xp);

          return {
            ...bet,
            status: (won ? 'won' : 'lost') as Bet['status'],
            resolvedAt: now,
            profit,
          };
        });

        set((state) => ({
          activeBets: state.activeBets.filter(
            (b) => !toResolve.find((r) => r.id === b.id)
          ),
          betHistory: [
            ...resolvedBets,
            ...state.betHistory,
          ].slice(0, MAX_BET_HISTORY),
        }));
      },
    }),
    { name: 'dopamix_bets' }
  )
);
