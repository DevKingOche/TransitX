"use client";

import { use } from "react";
import { MapPin, Truck, Calendar, ExternalLink } from "lucide-react";
import { useShipment, useUpdateShipmentStatus } from "@/hooks/use-shipments";
import { Badge, Button, Card } from "@/components/ui";
import { formatDate, formatUSDCDecimal, truncateAddress } from "@/lib/format";
import type { ShipmentStatus } from "@/store/shipment";

const STATUS_VARIANT: Record<ShipmentStatus, "default" | "success" | "warning" | "destructive" | "outline"> = {
  draft: "outline",
  pending_pickup: "warning",
  in_transit: "default",
  delivered: "success",
  disputed: "destructive",
  cancelled: "outline",
};

const STELLAR_EXPERT_BASE = "https://stellar.expert/explorer/testnet/account";

export default function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: shipment, isLoading } = useShipment(id);
  const { mutate: updateStatus, isPending } = useUpdateShipmentStatus();

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="h-8 w-48 rounded bg-muted animate-pulse mb-6" />
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-muted-foreground">Shipment not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-mono mb-1">{shipment.trackingNumber}</p>
          <h1 className="text-2xl font-bold">
            {shipment.origin} → {shipment.destination}
          </h1>
        </div>
        <Badge variant={STATUS_VARIANT[shipment.status]} className="text-sm px-3 py-1">
          {shipment.status.replace("_", " ")}
        </Badge>
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Shipment Details</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Origin</dt>
            <dd className="font-medium flex items-center gap-1 mt-0.5">
              <MapPin size={13} /> {shipment.origin}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Destination</dt>
            <dd className="font-medium flex items-center gap-1 mt-0.5">
              <Truck size={13} /> {shipment.destination}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Payment</dt>
            <dd className="font-medium mt-0.5">{formatUSDCDecimal(shipment.paymentAmount)} USDC</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Created</dt>
            <dd className="font-medium flex items-center gap-1 mt-0.5">
              <Calendar size={13} /> {formatDate(shipment.createdAt)}
            </dd>
          </div>
        </dl>
      </Card>

      {shipment.escrowAddress && (
        <Card>
          <h2 className="font-semibold mb-3">Escrow</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-mono text-muted-foreground">
              {truncateAddress(shipment.escrowAddress)}
            </span>
            <a
              href={`${STELLAR_EXPERT_BASE}/${shipment.escrowAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-500 hover:text-brand-700"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        </Card>
      )}

      {/* Status actions */}
      <Card>
        <h2 className="font-semibold mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          {shipment.status === "pending_pickup" && (
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => updateStatus({ id: shipment.id, status: "in_transit" })}
            >
              Mark Picked Up
            </Button>
          )}
          {shipment.status === "in_transit" && (
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => updateStatus({ id: shipment.id, status: "delivered" })}
            >
              Confirm Delivery
            </Button>
          )}
          {["pending_pickup", "in_transit"].includes(shipment.status) && (
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => updateStatus({ id: shipment.id, status: "disputed" })}
            >
              Raise Dispute
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
