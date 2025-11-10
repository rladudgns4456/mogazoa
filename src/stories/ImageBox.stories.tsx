import type { Meta, StoryObj } from "@storybook/react";
import ImageBox from "@/components/ImageBox";

const meta: Meta<typeof ImageBox> = {
  title: "Components/ImageBox",
  component: ImageBox,
};

export default meta;
type Story = StoryObj<typeof ImageBox>;

export const products: Story = {
  args: {
    variant: "products",
  },
  argTypes: {
    size: {
      control: false,
    },
    variant: {
      control: false,
    },
  },
};

export const profile: Story = {
  args: {
    variant: "profile",
  },

  argTypes: {
    variant: {
      control: false,
    },
  },
};
export const review: Story = {
  args: {
    variant: "review",
  },

  argTypes: {
    size: {
      control: false,
    },
    variant: {
      control: false,
    },
  },
};
