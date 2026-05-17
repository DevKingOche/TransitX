import { BarChart3, TrendingUp, Package, DollarSign } from "lucide-react";
import { Card } from "@/components/ui";

const metrics = [
  { label: "Total Shipments", value: "—", icon: Package, change: null },
  { label: "Total Volume (USDC)", value: "—", icon: DollarSign, change: null },
  { label: "On-Time Delivery Rate", value: "—", icon: TrendingUp, change: null },
  { label: "Active Carriers", value: "—", icon: BarChart3, change: null },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {metrics.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <Icon className="w-5 h-5 text-brand-500 mb-2" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Shipment Volume Over Time</h2>
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
          Chart coming soon — connect your data source
        </div>
      </Card>
    </div>
  );
}
