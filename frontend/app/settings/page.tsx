"use client";

import { useWallet } from "@/hooks/use-wallet";
import { Button, Card, Input } from "@/components/ui";
import { truncateAddress } from "@/lib/format";

export default function SettingsPage() {
  const { address, isConnected, connect, disconnect } = useWallet();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <h2 className="font-semibold mb-4">Stellar Wallet</h2>
        {isConnected && address ? (
          <div className="space-y-3">
            <Input
              label="Connected Address"
              value={address}
              readOnly
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Short: {truncateAddress(address)}
            </p>
            <Button variant="secondary" size="sm" onClick={disconnect}>
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Connect your Stellar wallet to sign transactions and receive payments.
            </p>
            <Button size="sm" onClick={connect}>
              Connect Wallet
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Network</h2>
        <p className="text-sm text-muted-foreground">
          Current network:{" "}
          <span className="font-medium text-foreground">
            {process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet"}
          </span>
        </p>
      </Card>
    </div>
  );
}
