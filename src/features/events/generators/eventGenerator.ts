import type { FictionalEvent, EventCategory } from '../../../types';
import {
  generateEvent as engineGenerate,
  generateBatch as engineBatch,
  refreshEvents as engineRefresh,
} from '../../../services/eventEngine';

export function generateEvent(category?: EventCategory): FictionalEvent {
  return engineGenerate(category);
}

export function generateBatch(count: number): FictionalEvent[] {
  return engineBatch(count);
}

export function refreshEvents(existing: FictionalEvent[]): FictionalEvent[] {
  return engineRefresh(existing);
}

export function filterByCategory(
  events: FictionalEvent[],
  category: EventCategory | 'all'
): FictionalEvent[] {
  if (category === 'all') return events;
  return events.filter((e) => e.category === category);
}

export function filterBySearch(
  events: FictionalEvent[],
  query: string
): FictionalEvent[] {
  if (!query.trim()) return events;
  const q = query.toLowerCase();
  return events.filter(
    (e) =>
      e.homeTeam.toLowerCase().includes(q) ||
      e.awayTeam.toLowerCase().includes(q) ||
      e.league.toLowerCase().includes(q)
  );
}

export function sortByStartTime(events: FictionalEvent[]): FictionalEvent[] {
  return [...events].sort((a, b) => a.startTime - b.startTime);
}

export function getLiveEvents(events: FictionalEvent[]): FictionalEvent[] {
  return events.filter((e) => e.status === 'live');
}

export function getUpcomingEvents(events: FictionalEvent[]): FictionalEvent[] {
  return events.filter((e) => e.status === 'upcoming');
}
