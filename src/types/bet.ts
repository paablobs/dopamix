export type BetStatus = 'active' | 'won' | 'lost';

export type BetSelection = 'home' | 'draw' | 'away';

export interface BetSlipItem {
  eventId: string;
  eventSummary: string;
  selection: BetSelection;
  odds: number;
  homeIcon: string;
  awayIcon: string;
}

export interface Bet {
  id: string;
  eventId: string;
  eventSummary: string;
  selection: BetSelection;
  odds: number;
  stake: number;
  potentialWin: number;
  status: BetStatus;
  placedAt: number;
  resolvedAt: number | null;
  resolutionDelay: number;
  profit: number | null;
}
