import { HOUSE_EDGE } from '../constants/betting';

export function impliedProbability(odds: number): number {
  return 1 / odds;
}

export function adjustForHouseEdge(probability: number): number {
  return probability * (1 - HOUSE_EDGE);
}

export function generateOddsForMatch(): { home: number; draw: number | null; away: number } {
  const homeStrength = Math.random();
  const awayStrength = Math.random();
  const total = homeStrength + awayStrength;

  const homeProb = homeStrength / total;
  const awayProb = awayStrength / total;

  const hasDraw = Math.random() > 0.4;

  if (hasDraw) {
    const drawProb = 0.15 + Math.random() * 0.15;
    const remaining = 1 - drawProb;
    const homeAdj = homeProb * remaining;
    const awayAdj = awayProb * remaining;

    return {
      home: Math.round((1 / (homeAdj * (1 - HOUSE_EDGE))) * 100) / 100,
      draw: Math.round((1 / (drawProb * (1 - HOUSE_EDGE))) * 100) / 100,
      away: Math.round((1 / (awayAdj * (1 - HOUSE_EDGE))) * 100) / 100,
    };
  }

  return {
    home: Math.round((1 / (homeProb * (1 - HOUSE_EDGE))) * 100) / 100,
    draw: null,
    away: Math.round((1 / (awayProb * (1 - HOUSE_EDGE))) * 100) / 100,
  };
}
