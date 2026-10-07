import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { MockInvoice, mockSubscription } from "@/../mocks/billing";

export function useBilling() {
  const subscriptionQuery = useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: () => apiClient<typeof mockSubscription>("/billing/subscription"),
  });

  const invoicesQuery = useQuery({
    queryKey: ["billing", "invoices"],
    queryFn: () => apiClient<MockInvoice[]>("/billing/invoices"),
  });

  return {
    subscription: subscriptionQuery.data || mockSubscription,
    invoices: invoicesQuery.data || [],
    isLoading: subscriptionQuery.isLoading || invoicesQuery.isLoading,
  };
}
