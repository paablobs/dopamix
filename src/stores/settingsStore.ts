import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  animationsEnabled: boolean;
  currencyFormat: 'credits' | 'coins' | 'gems';
  toggleAnimations: () => void;
  setCurrencyFormat: (format: 'credits' | 'coins' | 'gems') => void;
}

const SETTINGS_STORE_VERSION = 2;

function migrateSettingsState(persisted: unknown): Partial<SettingsState> {
  if (!persisted || typeof persisted !== 'object') return {};
  const state = persisted as Partial<SettingsState>;
  return {
    animationsEnabled: state.animationsEnabled !== false,
    currencyFormat: state.currencyFormat === 'coins' || state.currencyFormat === 'gems'
      ? state.currencyFormat
      : 'credits',
  };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      animationsEnabled: true,
      currencyFormat: 'credits',

      toggleAnimations: () => set((s) => ({ animationsEnabled: !s.animationsEnabled })),
      setCurrencyFormat: (format) => set({ currencyFormat: format }),
    }),
    {
      name: 'dopamix_settings',
      version: SETTINGS_STORE_VERSION,
      migrate: (persisted: unknown) => migrateSettingsState(persisted),
    }
  )
);
