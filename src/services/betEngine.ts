import type { Bet, BetSelection, BetSlipItem, EventOdds, FictionalEvent } from '../types';
import { HOUSE_EDGE, XP_PER_BET, XP_PER_WIN_BONUS } from '../constants/betting';
import { randomInt, weightedRandom } from '../utils/random';
import { generateId } from '../utils/id';

export function calculatePotentialWin(stake: number, odds: number): number {
  return Math.round(stake * odds * 100) / 100;
}

function isBetSelection(value: unknown): value is BetSelection {
  return value === 'home' || value === 'draw' || value === 'away';
}

function hasSameOdds(left: EventOdds | undefined, right: EventOdds): boolean {
  return !!left && left.home === right.home && left.draw === right.draw && left.away === right.away;
}

function isValidEventOdds(odds: unknown): odds is EventOdds {
  if (!odds || typeof odds !== 'object') return false;
  const candidate = odds as Partial<EventOdds>;
  return typeof candidate.home === 'number' && candidate.home > 0 &&
    typeof candidate.away === 'number' && candidate.away > 0 &&
    (candidate.draw === null || (typeof candidate.draw === 'number' && candidate.draw > 0));
}

export function isValidBetSlipItem(item: unknown, event: FictionalEvent): item is BetSlipItem {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Partial<BetSlipItem>;
  if (candidate.eventId !== event.id || !isBetSelection(candidate.selection)) return false;
  if (!isValidEventOdds(event.odds)) return false;

  const currentOdds = event.odds[candidate.selection];
  if (currentOdds === null || !Number.isFinite(currentOdds) || candidate.odds !== currentOdds) return false;
  return hasSameOdds(candidate.eventOdds, event.odds);
}

export function resolveOutcome(
  homeOdds: number,
  drawOdds: number | null,
  awayOdds: number,
  selection: BetSelection
): boolean {
  const selections: { selection: BetSelection; odds: number }[] = [
    { selection: 'home', odds: homeOdds },
    { selection: 'away', odds: awayOdds },
  ];
  if (drawOdds !== null) {
    selections.push({ selection: 'draw', odds: drawOdds });
  }

  const items = selections.map((s) => ({
    weight: adjustProbability(s.odds),
    value: s.selection,
  }));

  const winner = weightedRandom(items);
  return winner === selection;
}

function adjustProbability(odds: number): number {
  const implied = 1 / odds;
  const adjusted = implied * (1 - HOUSE_EDGE);
  return Math.max(0.01, adjusted);
}

export function generateResolutionDelay(): number {
  const items = [
    { weight: 30, value: randomInt(15, 60) },
    { weight: 25, value: randomInt(60, 120) },
    { weight: 20, value: randomInt(120, 240) },
    { weight: 15, value: randomInt(240, 360) },
    { weight: 10, value: randomInt(360, 480) },
  ];
  return weightedRandom(items);
}

export function createBet(
  eventId: string,
  eventSummary: string,
  selection: BetSelection,
  odds: number,
  eventOdds: EventOdds,
  stake: number
): Bet {
  return {
    id: generateId(),
    eventId,
    eventSummary,
    selection,
    odds,
    eventOdds,
    stake,
    potentialWin: calculatePotentialWin(stake, odds),
    status: 'active',
    placedAt: Date.now(),
    resolvedAt: null,
    resolutionDelay: generateResolutionDelay(),
    profit: null,
  };
}

export function calculateXpReward(bet: Bet, won: boolean): number {
  let xp = XP_PER_BET;
  if (won) xp += XP_PER_WIN_BONUS;
  if (bet.stake >= 500) xp += 10;
  return xp;
}
