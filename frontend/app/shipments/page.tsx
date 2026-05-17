"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useShipments } from "@/hooks/use-shipments";
import { ShipmentCard } from "@/components/shipment-card";
import { Button } from "@/components/ui";

export default function ShipmentsPage() {
  const { data: shipments, isLoading, error } = useShipments();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Shipments</h1>
        <Link href="/shipments/create">
          <Button size="sm">
            <Plus size={14} className="mr-1.5" />
            New Shipment
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl border border-border animate-pulse bg-muted" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">Failed to load shipments. Please try again.</p>
      )}

      {shipments && shipments.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="mb-4">No shipments yet.</p>
          <Link href="/shipments/create">
            <Button>Create your first shipment</Button>
          </Link>
        </div>
      )}

      {shipments && shipments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shipments.map((s) => (
            <ShipmentCard key={s.id} shipment={s} />
          ))}
        </div>
      )}
    </div>
  );
}
