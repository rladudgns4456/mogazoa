import type { StoryObj, Meta } from "@storybook/react";
import { SortingSelect } from "@/components/selectBox";

const meta: Meta<typeof SortingSelect> = {
  title: "Components/SortingSelect",
  component: SortingSelect,
};
export default meta;

type Story = StoryObj<typeof SortingSelect>;

export const Default: Story = {
  args: {
    placeHolder: "최신글",
  },
};
