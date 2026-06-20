"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useApiQuery<T>(key: readonly unknown[], path: string, enabled = true) {
  return useQuery({
    queryKey: key,
    enabled,
    queryFn: async () => {
      const response = await api.get<T>(path);
      return response.data;
    },
    retry: 1
  });
}

