"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateShipment } from "@/hooks/use-shipments";
import { Button, Input } from "@/components/ui";

const schema = z.object({
  origin: z.string().min(3, "Origin is required"),
  destination: z.string().min(3, "Destination is required"),
  cargoDescription: z.string().min(5, "Describe the cargo"),
  weightKg: z.coerce.number().positive("Weight must be positive"),
  paymentAmount: z.coerce.number().positive("Payment amount must be positive"),
  paymentCurrency: z.enum(["USDC"]),
  pickupDate: z.string().min(1, "Pickup date is required"),
});

type FormValues = z.infer<typeof schema>;

export default function CreateShipmentPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateShipment();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { paymentCurrency: "USDC" },
  });

  async function onSubmit(values: FormValues) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shipment = await mutateAsync(values as any);
    router.push(`/shipments/${shipment.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Create Shipment</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="origin"
          label="Origin"
          placeholder="e.g. Lagos, Nigeria"
          error={errors.origin?.message}
          {...register("origin")}
        />
        <Input
          id="destination"
          label="Destination"
          placeholder="e.g. Nairobi, Kenya"
          error={errors.destination?.message}
          {...register("destination")}
        />
        <Input
          id="cargoDescription"
          label="Cargo Description"
          placeholder="e.g. Electronics — 20 units"
          error={errors.cargoDescription?.message}
          {...register("cargoDescription")}
        />
        <Input
          id="weightKg"
          label="Weight (kg)"
          type="number"
          step="0.1"
          placeholder="e.g. 500"
          error={errors.weightKg?.message}
          {...register("weightKg")}
        />
        <Input
          id="paymentAmount"
          label="Payment Amount (USDC)"
          type="number"
          step="0.01"
          placeholder="e.g. 1500.00"
          error={errors.paymentAmount?.message}
          {...register("paymentAmount")}
        />
        <Input
          id="pickupDate"
          label="Pickup Date"
          type="date"
          error={errors.pickupDate?.message}
          {...register("pickupDate")}
        />

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create Shipment"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
