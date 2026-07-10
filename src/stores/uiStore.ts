import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  betSlipOpen: boolean;
  activeModal: string | null;
  toggleSidebar: () => void;
  toggleBetSlip: () => void;
  openBetSlip: () => void;
  closeBetSlip: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: true,
  betSlipOpen: false,
  activeModal: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleBetSlip: () => set((s) => ({ betSlipOpen: !s.betSlipOpen })),
  openBetSlip: () => set({ betSlipOpen: true }),
  closeBetSlip: () => set({ betSlipOpen: false }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
