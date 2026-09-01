import { create } from 'zustand';
import { IProduct } from '@smashd/types';

interface UIState {
  isCartDrawerOpen: boolean;
  isMobileNavOpen: boolean;
  activeCustomizerProduct: IProduct | null;

  // Actions
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  openCustomizer: (product: IProduct) => void;
  closeCustomizer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartDrawerOpen: false,
  isMobileNavOpen: false,
  activeCustomizerProduct: null,

  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  openCustomizer: (product) => set({ activeCustomizerProduct: product }),
  closeCustomizer: () => set({ activeCustomizerProduct: null }),
}));
