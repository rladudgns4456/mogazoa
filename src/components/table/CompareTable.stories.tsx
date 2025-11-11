import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import CompareTable from "./CompareTable";

const meta = {
  component: CompareTable,
} satisfies Meta<typeof CompareTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    top: {},
    rows: [],
    side: {},
  },
};
