import { useQuery } from "@tanstack/react-query";
import { fetchDatasetSummary } from "@/lib/api";

export function useDatasetSummary() {
  return useQuery({
    queryKey: ["dataset-summary"],
    queryFn: fetchDatasetSummary,
    retry: 2,
    refetchInterval: 30000,
  });
}
