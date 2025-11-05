import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 600_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  });
}

let browserClient: QueryClient | undefined;
export const getQueryClient = () =>
  typeof window === "undefined" ? makeQueryClient() : (browserClient ??= makeQueryClient());
