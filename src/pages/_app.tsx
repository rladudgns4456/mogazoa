import "@/styles/globals.css";
import HeaderLayout from "@/layout/headerLayout";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { getQueryClient } from "@/lib/reactQuery";

const queryClient = getQueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <HeaderLayout>
        <Component {...pageProps} />
      </HeaderLayout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
