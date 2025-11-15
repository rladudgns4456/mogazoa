import "@/styles/globals.css";
import type { Preview } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from 'react';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

// decorators 배열에 QueryClientProvider를 추가
export const decorators = [
   (Story: () => ReactNode) => (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  ),
];

export default preview;
