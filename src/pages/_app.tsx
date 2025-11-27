import { AuthProvider } from "@/components/login/AuthContext";
import { ModalProvider } from "@/components/modal/modalBase";
import { ModalWrap } from "@/components/modal/modalBase";
import { ToastProvider, ToastWrap } from "@/components/toast";
import HeaderLayout from "@/layout/headerLayout";
import { getQueryClient } from "@/lib/reactQuery";
import "@/styles/globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";

const queryClient = getQueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <ToastProvider>
            <HeaderLayout>
              <Component {...pageProps} />
            </HeaderLayout>
            <ReactQueryDevtools initialIsOpen={false} />
            <ModalWrap />
            <ToastWrap />
          </ToastProvider>
        </ModalProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
