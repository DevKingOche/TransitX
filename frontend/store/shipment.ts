import { create } from "zustand";

export type ShipmentStatus =
  | "draft"
  | "pending_pickup"
  | "in_transit"
  | "delivered"
  | "disputed"
  | "cancelled";

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  carrierId: string | null;
  shipperId: string;
  paymentAmount: string;
  escrowAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ShipmentState {
  shipments: Shipment[];
  selected: Shipment | null;
  setShipments: (shipments: Shipment[]) => void;
  setSelected: (shipment: Shipment | null) => void;
  upsert: (shipment: Shipment) => void;
}

export const useShipmentStore = create<ShipmentState>((set) => ({
  shipments: [],
  selected: null,
  setShipments: (shipments) => set({ shipments }),
  setSelected: (selected) => set({ selected }),
  upsert: (shipment) =>
    set((state) => {
      const idx = state.shipments.findIndex((s) => s.id === shipment.id);
      if (idx === -1) return { shipments: [shipment, ...state.shipments] };
      const updated = [...state.shipments];
      updated[idx] = shipment;
      return { shipments: updated };
    }),
}));
