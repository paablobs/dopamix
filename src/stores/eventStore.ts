import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FictionalEvent } from '../types';
import { refreshEvents } from '../services/eventEngine';

const LIVE_DURATION = 120000;
const FINISHED_DURATION = 300000;

interface EventState {
  events: FictionalEvent[];
  lastGeneratedAt: number;
  generateEvents: () => void;
  refreshExpired: () => void;
  tickEvents: () => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      lastGeneratedAt: 0,

      generateEvents: () => {
        const refreshed = refreshEvents(get().events);
        set({ events: refreshed, lastGeneratedAt: Date.now() });
      },

      refreshExpired: () => {
        const { events, lastGeneratedAt } = get();
        const now = Date.now();
        if (now - lastGeneratedAt > 300000 || events.length < 5) {
          const refreshed = refreshEvents(events);
          set({ events: refreshed, lastGeneratedAt: now });
        }
      },

      tickEvents: () => {
        const now = Date.now();
        const { events } = get();
        let changed = false;

        const updated = events.map((e) => {
          if (e.status === 'upcoming' && e.startTime <= now) {
            changed = true;
            return { ...e, status: 'live' as const };
          }
          if (e.status === 'live' && e.startTime + LIVE_DURATION <= now) {
            changed = true;
            return { ...e, status: 'finished' as const };
          }
          return e;
        });

        const filtered = updated.filter((e) => {
          if (e.status === 'finished' && e.startTime + FINISHED_DURATION <= now) return false;
          return true;
        });

        if (changed || filtered.length !== events.length) {
          set({ events: filtered });
        }
      },
    }),
    { name: 'dopamix_events' }
  )
);
