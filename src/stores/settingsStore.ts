import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  animationsEnabled: boolean;
  currencyFormat: 'credits' | 'coins' | 'gems';
  toggleAnimations: () => void;
  setCurrencyFormat: (format: 'credits' | 'coins' | 'gems') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      animationsEnabled: true,
      currencyFormat: 'credits',

      toggleAnimations: () => set((s) => ({ animationsEnabled: !s.animationsEnabled })),
      setCurrencyFormat: (format) => set({ currencyFormat: format }),
    }),
    { name: 'dopamix_settings' }
  )
);
