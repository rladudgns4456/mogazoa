import type { Meta, StoryObj } from "@storybook/react";
import Banner from "@/components/banner";

const meta: Meta<typeof Banner> = {
  title: "Components/Banner",
  component: Banner,
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    message: "모가조아에서 지금 핫한 상품을 비교해보세요! 🚀",
  },
};
