import { Truck, Star, MapPin } from "lucide-react";
import { Card, Badge } from "@/components/ui";

// Static placeholder data — replace with API call
const CARRIERS = [
  { id: "1", name: "SwiftCargo Ltd", rating: 4.8, location: "Lagos, Nigeria", verified: true, shipments: 142 },
  { id: "2", name: "TransAfrica Logistics", rating: 4.6, location: "Nairobi, Kenya", verified: true, shipments: 98 },
  { id: "3", name: "EastRoute Freight", rating: 4.3, location: "Dar es Salaam, Tanzania", verified: false, shipments: 57 },
];

export default function CarriersPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Carrier Network</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARRIERS.map((carrier) => (
          <Card key={carrier.id}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center">
                  <Truck size={16} className="text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{carrier.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin size={10} /> {carrier.location}
                  </p>
                </div>
              </div>
              {carrier.verified && <Badge variant="success">Verified</Badge>}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star size={13} className="text-yellow-500 fill-yellow-500" />
                {carrier.rating}
              </span>
              <span>{carrier.shipments} shipments</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
