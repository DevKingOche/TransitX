"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Shipment } from "@/store/shipment";

export function useShipments() {
  return useQuery<Shipment[]>({
    queryKey: ["shipments"],
    queryFn: async () => {
      const { data } = await apiClient.get("/shipments");
      return data;
    },
  });
}

export function useShipment(id: string) {
  return useQuery<Shipment>({
    queryKey: ["shipments", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/shipments/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Shipment>) => {
      const { data } = await apiClient.post("/shipments", payload);
      return data as Shipment;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shipments"] }),
  });
}

export function useUpdateShipmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Shipment["status"] }) => {
      const { data } = await apiClient.patch(`/shipments/${id}/status`, { status });
      return data as Shipment;
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["shipments"] });
      qc.invalidateQueries({ queryKey: ["shipments", id] });
    },
  });
}
