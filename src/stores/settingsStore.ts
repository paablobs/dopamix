import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  currencyFormat: 'credits' | 'coins' | 'gems';
  toggleSound: () => void;
  toggleAnimations: () => void;
  setCurrencyFormat: (format: 'credits' | 'coins' | 'gems') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      animationsEnabled: true,
      currencyFormat: 'credits',

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleAnimations: () => set((s) => ({ animationsEnabled: !s.animationsEnabled })),
      setCurrencyFormat: (format) => set({ currencyFormat: format }),
    }),
    { name: 'dopamix_settings' }
  )
);
