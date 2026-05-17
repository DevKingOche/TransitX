import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Truck, Clock, CheckCircle } from "lucide-react";

const stats = [
  { label: "Active Shipments", value: "—", icon: Package },
  { label: "In Transit", value: "—", icon: Truck },
  { label: "Pending Pickup", value: "—", icon: Clock },
  { label: "Delivered", value: "—", icon: CheckCircle },
];

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="border rounded-xl p-5">
            <Icon className="w-5 h-5 text-brand-500 mb-2" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent shipments placeholder */}
      <div className="border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Recent Shipments</h2>
        <p className="text-sm text-gray-500">No shipments yet. <Link href="/shipments/create" className="text-brand-600 underline">Create your first shipment →</Link></p>
      </div>
    </div>
  );
}
