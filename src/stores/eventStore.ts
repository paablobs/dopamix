import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FictionalEvent } from '../types';
import {
  EVENT_FINISHED_RETENTION,
  getEventStatusAt,
  refreshEvents,
} from '../services/eventEngine';

interface EventState {
  events: FictionalEvent[];
  lastGeneratedAt: number;
  generateEvents: () => void;
  refreshExpired: () => void;
  tickEvents: () => void;
}

const EVENT_STORE_VERSION = 2;

function migrateEventState(persisted: unknown): Partial<EventState> {
  if (!persisted || typeof persisted !== 'object') return {};
  const state = persisted as Partial<EventState>;
  return {
    events: Array.isArray(state.events) ? state.events : [],
    lastGeneratedAt: typeof state.lastGeneratedAt === 'number' && Number.isFinite(state.lastGeneratedAt)
      ? state.lastGeneratedAt
      : 0,
  };
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
          const status = getEventStatusAt(e, now);
          if (status !== e.status) {
            changed = true;
            return { ...e, status };
          }
          return e;
        });

        const filtered = updated.filter((e) => {
          if (e.status === 'finished' && e.startTime + EVENT_FINISHED_RETENTION <= now) return false;
          return true;
        });

        if (changed || filtered.length !== events.length) {
          set({ events: filtered });
        }
      },
    }),
    {
      name: 'dopamix_events',
      version: EVENT_STORE_VERSION,
      migrate: (persisted: unknown) => migrateEventState(persisted),
    }
  )
);
