import Link from "next/link";
import { Package, Truck, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Freight Management",
    description: "Create and track freight jobs from origin to destination with full audit trails.",
  },
  {
    icon: Truck,
    title: "Carrier Network",
    description: "Connect with verified carriers and assign shipments with on-chain accountability.",
  },
  {
    icon: Shield,
    title: "Escrow Payments",
    description: "Milestone-based USDC payments via Trustless Work — funds release only on delivery.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Real-time dashboards for shippers, carriers, and brokers.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-500 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">TransitX</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Decentralized freight and logistics, transparently secured on Stellar.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/auth/sign-up"
            className="bg-white text-brand-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Get Started
          </Link>
          <Link
            href="/how-it-works"
            className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition"
          >
            How It Works
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need for modern freight</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="border rounded-xl p-6 hover:shadow-md transition">
              <Icon className="w-8 h-8 text-brand-500 mb-3" />
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to modernize your freight operations?</h2>
        <Link
          href="/auth/sign-up"
          className="inline-block bg-brand-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-brand-700 transition"
        >
          Create Free Account
        </Link>
      </section>
    </main>
  );
}
