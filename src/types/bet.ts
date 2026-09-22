import type { EventOdds } from './event';

export type BetStatus = 'active' | 'won' | 'lost' | 'refunded';

export type BetSelection = 'home' | 'draw' | 'away';

export interface BetSlipItem {
  eventId: string;
  eventSummary: string;
  selection: BetSelection;
  odds: number;
  eventOdds: EventOdds;
  homeIcon: string;
  awayIcon: string;
}

export interface Bet {
  id: string;
  eventId: string;
  eventSummary: string;
  selection: BetSelection;
  odds: number;
  eventOdds?: EventOdds;
  stake: number;
  potentialWin: number;
  status: BetStatus;
  placedAt: number;
  resolvedAt: number | null;
  resolutionDelay: number;
  profit: number | null;
}
