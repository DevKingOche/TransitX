import { create } from "zustand";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  connecting: boolean;
  setAddress: (address: string | null) => void;
  setConnecting: (connecting: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  isConnected: false,
  connecting: false,
  setAddress: (address) => set({ address, isConnected: !!address }),
  setConnecting: (connecting) => set({ connecting }),
  disconnect: () => set({ address: null, isConnected: false, connecting: false }),
}));
