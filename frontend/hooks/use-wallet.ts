"use client";

import { useCallback } from "react";
import { useWalletStore } from "@/store/wallet";
import { getWalletsKit } from "@/lib/stellar";
import { truncateAddress } from "@/lib/format";

export function useWallet() {
  const { address, isConnected, connecting, setAddress, setConnecting, disconnect } =
    useWalletStore();

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const kit = getWalletsKit();
      await kit.openModal({
        onWalletSelected: async (option) => {
          kit.setWallet(option.id);
          const { address: addr } = await kit.getAddress();
          setAddress(addr);
        },
      });
    } catch (err) {
      console.error("Wallet connection failed:", err);
    } finally {
      setConnecting(false);
    }
  }, [setAddress, setConnecting]);

  return {
    address,
    shortAddress: address ? truncateAddress(address) : null,
    isConnected,
    connecting,
    connect,
    disconnect,
  };
}
