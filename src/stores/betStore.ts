import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bet, BetSlipItem } from '../types';
import {
  createBet,
  calculateXpReward,
  isValidBetSlipItem,
  resolveOutcome,
} from '../services/betEngine';
import { useBalanceStore } from './balanceStore';
import { useRewardStore } from './rewardStore';
import { useEventStore } from './eventStore';
import { notifyBetWon, notifyBetLost } from '../services/notificationService';
import { MAX_BET_HISTORY } from '../constants/rewards';
import { MIN_STAKE } from '../constants/betting';
import { getEventStatusAt } from '../services/eventEngine';

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

const BET_STORE_VERSION = 2;

function migrateBetState(persisted: unknown): Partial<BetState> {
  if (!persisted || typeof persisted !== 'object') return {};
  const state = persisted as Partial<BetState>;
  return {
    betSlip: Array.isArray(state.betSlip) ? state.betSlip : [],
    activeBets: Array.isArray(state.activeBets) ? state.activeBets : [],
    betHistory: Array.isArray(state.betHistory) ? state.betHistory : [],
  };
}

export const useBetStore = create<BetState>()(
  persist(
    (set, get) => ({
      betSlip: [],
      activeBets: [],
      betHistory: [],

      addToBetSlip: (item) => {
        set((state) => ({
          betSlip: state.betSlip.some((b) => b.eventId === item.eventId)
            ? state.betSlip.map((b) => b.eventId === item.eventId ? item : b)
            : [item],
        }));
      },

      removeFromBetSlip: (eventId) => {
        set((state) => ({
          betSlip: state.betSlip.filter((b) => b.eventId !== eventId),
        }));
      },

      clearBetSlip: () => set({ betSlip: [] }),

      placeBet: (stake) => {
        const { betSlip } = get();
        if (betSlip.length !== 1) return false;
        if (!Number.isSafeInteger(stake) || stake < MIN_STAKE) return false;

        const selection = betSlip[0];
        if (!selection || typeof selection !== 'object' || typeof selection.eventId !== 'string') return false;
        const event = useEventStore.getState().events.find((e) => e.id === selection.eventId);
        if (!event || getEventStatusAt(event) === 'finished' || !isValidBetSlipItem(selection, event)) return false;

        const odds = event.odds[selection.selection];
        if (odds === null) return false;

        const balanceStore = useBalanceStore.getState();
        if (!balanceStore.deductCredits(stake)) return false;

        const bet = createBet(
          event.id,
          `${event.homeTeam} vs ${event.awayTeam}`,
          selection.selection,
          odds,
          event.odds,
          stake
        );

        set((state) => ({
          activeBets: [...state.activeBets, bet],
          betSlip: [],
        }));

        const rewardStore = useRewardStore.getState();
        rewardStore.addXp(10);
        rewardStore.incrementBetCount(stake);
        return true;
      },

      tickBets: () => {
        const now = Date.now();
        const { activeBets } = get();
        const events = useEventStore.getState().events;
        const orphanedBets = activeBets.filter(
          (bet) => !events.some((event) => event.id === bet.eventId)
        );
        const toResolve: Bet[] = [];

        activeBets.forEach((bet) => {
          const elapsed = (now - bet.placedAt) / 1000;
          const event = events.find((candidate) => candidate.id === bet.eventId);
          if (!event || getEventStatusAt(event, now) === 'upcoming') return;

          const readyAt = Math.max(
            bet.placedAt + bet.resolutionDelay * 1000,
            event.startTime,
          );
          if (elapsed >= bet.resolutionDelay && now >= readyAt) {
            toResolve.push(bet);
          }
        });

        if (toResolve.length === 0 && orphanedBets.length === 0) return;

        const balanceStore = useBalanceStore.getState();
        const rewardStore = useRewardStore.getState();

        orphanedBets.forEach((bet) => {
          balanceStore.addCredits(bet.stake, `Refunded: ${bet.eventSummary}`);
        });

        const refundedBets = orphanedBets.map((bet) => ({
          ...bet,
          status: 'refunded' as const,
          resolvedAt: now,
          profit: 0,
        }));

        const resolvedBets = toResolve.map((bet) => {
          const won = bet.eventOdds
            ? resolveOutcome(bet.eventOdds.home, bet.eventOdds.draw, bet.eventOdds.away, bet.selection)
            : Math.random() > 0.52;
          const multiplier = won ? rewardStore.consumeMultiplier() : 1;
          const payout = bet.potentialWin * multiplier;
          const profit = won ? payout - bet.stake : -bet.stake;

          if (won) {
            balanceStore.addCredits(payout, `Won: ${bet.eventSummary}`);
            notifyBetWon(payout);
            rewardStore.recordWin(payout);
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
            (b) => !orphanedBets.some((orphaned) => orphaned.id === b.id) &&
              !toResolve.some((resolved) => resolved.id === b.id)
          ),
          betHistory: [
            ...refundedBets,
            ...resolvedBets,
            ...state.betHistory,
          ].slice(0, MAX_BET_HISTORY),
        }));
      },
    }),
    {
      name: 'dopamix_bets',
      version: BET_STORE_VERSION,
      migrate: (persisted: unknown) => migrateBetState(persisted),
    }
  )
);
