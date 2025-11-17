import type { StoryObj, Meta } from "@storybook/react";
import { CategorySelect } from "@/components/selectBox";

const meta: Meta<typeof CategorySelect> = {
  title: "Components/CategorySelect",
  component: CategorySelect,
};
export default meta;

type Story = StoryObj<typeof CategorySelect>;

export const Default: Story = {
  args: {
    placeHolder: "카테고리 선택",
  },
};
