import { Package, Truck, CheckCircle, Shield, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Package,
    step: "1",
    title: "Create a Shipment",
    description:
      "Shipper creates a freight job with origin, destination, cargo details, and payment milestones. A Stellar escrow is deployed via Trustless Work — funds are locked until delivery.",
  },
  {
    icon: Truck,
    step: "2",
    title: "Carrier Assignment",
    description:
      "A verified carrier accepts the job. The carrier's Stellar address is recorded on-chain, creating an immutable assignment record.",
  },
  {
    icon: ArrowRight,
    step: "3",
    title: "Pickup & Transit",
    description:
      "Carrier logs pickup. The first milestone payment is released from escrow to the carrier's Stellar address. All events are recorded on-chain.",
  },
  {
    icon: CheckCircle,
    step: "4",
    title: "Delivery & Settlement",
    description:
      "Carrier confirms delivery. Remaining USDC is released from escrow. The shipper receives a verified delivery record on Stellar.",
  },
  {
    icon: Shield,
    step: "5",
    title: "Dispute Resolution",
    description:
      "If a dispute arises, either party can escalate. A resolver adjudicates and the escrow releases accordingly — no intermediary holds the funds.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-center mb-4">How TransitX Works</h1>
      <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
        Every freight event is recorded on the Stellar blockchain. Payments are held in
        non-custodial escrow and released only when milestones are met.
      </p>

      <div className="space-y-8">
        {steps.map(({ icon: Icon, step, title, description }) => (
          <div key={step} className="flex gap-5">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Icon size={18} className="text-brand-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Step {step}</p>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
