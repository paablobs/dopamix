import type { FictionalEvent, EventCategory, EventStatus } from '../types';
import { generateId } from '../utils/id';
import { randomChoice, randomInt } from '../utils/random';
import { generateOddsForMatch } from '../utils/probability';
import {
  TEAM_ADJECTIVES,
  TEAM_NOUNS,
  LEAGUE_NAMES,
} from '../constants/events';

function generateTeamName(): string {
  return `${randomChoice(TEAM_ADJECTIVES)} ${randomChoice(TEAM_NOUNS)}`;
}

function generateLeagueName(): string {
  return randomChoice(LEAGUE_NAMES);
}

const CATEGORY_EMOJIS: Record<EventCategory, string[]> = {
  football: ['⚽', '🏟️'],
  basketball: ['🏀', '💪'],
  tennis: ['🎾', '🏆'],
  esports: ['🎮', '🖥️'],
  racing: ['🏎️', '🏁'],
};

export function generateEvent(category?: EventCategory): FictionalEvent {
  const cat = category || randomChoice(['football', 'basketball', 'tennis', 'esports', 'racing'] as EventCategory[]);
  const emojis = CATEGORY_EMOJIS[cat];
  const now = Date.now();
  const startOffset = randomInt(-300000, 7200000);
  const startTime = now + startOffset;
  const isLive = startOffset < 0 && startOffset > -3600000;
  const isFinished = startOffset < -3600000;

  let status: EventStatus = 'upcoming';
  if (isLive) status = 'live';
  if (isFinished) status = 'finished';

  return {
    id: generateId(),
    category: cat,
    league: generateLeagueName(),
    homeTeam: generateTeamName(),
    awayTeam: generateTeamName(),
    startTime,
    status,
    odds: generateOddsForMatch(),
    homeIcon: emojis[0],
    awayIcon: emojis[1],
  };
}

export function generateBatch(count: number): FictionalEvent[] {
  const events: FictionalEvent[] = [];
  for (let i = 0; i < count; i++) {
    events.push(generateEvent());
  }
  return events;
}

export function refreshEvents(existing: FictionalEvent[]): FictionalEvent[] {
  const now = Date.now();
  const active = existing.filter((e) => {
    const age = now - e.startTime;
    return age < 7200000;
  });

  const needed = Math.max(0, 20 - active.length);
  const newEvents = generateBatch(needed);
  return [...active, ...newEvents];
}
