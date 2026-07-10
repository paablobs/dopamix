import type { Bet, BetSelection } from '../types';
import { HOUSE_EDGE, XP_PER_BET, XP_PER_WIN_BONUS } from '../constants/betting';
import { randomInt, weightedRandom } from '../utils/random';
import { generateId } from '../utils/id';

export function calculatePotentialWin(stake: number, odds: number): number {
  return Math.round(stake * odds * 100) / 100;
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
  stake: number
): Bet {
  return {
    id: generateId(),
    eventId,
    eventSummary,
    selection,
    odds,
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
