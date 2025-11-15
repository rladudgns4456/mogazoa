import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import CategoryTab from "@/components/categoryTab";

const meta: Meta<typeof CategoryTab> = {
  title: "components/CategoryTab",
  component: CategoryTab,

  // tags: ['autodocs'],
  argTypes: {},

  args: {},
} satisfies Meta<typeof CategoryTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HOME: Story = {
  args: {
    isHome: true,
  },
};
export const categoryPage: Story = {
  args: {},
};

// export const Secondary: Story = {
//   args: {

//   },
// };
