import Link from "next/link";
import { MapPin, Truck, Calendar } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { formatDate, formatUSDCDecimal } from "@/lib/format";
import type { Shipment, ShipmentStatus } from "@/store/shipment";

const STATUS_VARIANT: Record<ShipmentStatus, "default" | "success" | "warning" | "destructive" | "outline"> = {
  draft: "outline",
  pending_pickup: "warning",
  in_transit: "default",
  delivered: "success",
  disputed: "destructive",
  cancelled: "outline",
};

const STATUS_LABEL: Record<ShipmentStatus, string> = {
  draft: "Draft",
  pending_pickup: "Pending Pickup",
  in_transit: "In Transit",
  delivered: "Delivered",
  disputed: "Disputed",
  cancelled: "Cancelled",
};

export function ShipmentCard({ shipment }: { shipment: Shipment }) {
  return (
    <Link href={`/shipments/${shipment.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground font-mono">{shipment.trackingNumber}</p>
            <p className="font-semibold mt-0.5">{formatUSDCDecimal(shipment.paymentAmount)} USDC</p>
          </div>
          <Badge variant={STATUS_VARIANT[shipment.status]}>
            {STATUS_LABEL[shipment.status]}
          </Badge>
        </div>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{shipment.origin}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck size={13} className="shrink-0" />
            <span className="truncate">{shipment.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={13} className="shrink-0" />
            <span>{formatDate(shipment.createdAt)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
