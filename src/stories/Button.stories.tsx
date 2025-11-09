import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import Button from "@/components/Button";
import Ic_close from "@/assets/svgr/ic_close.svg?react";

const meta: Meta<typeof Button> = {
  title: "Example/Button",
  component: Button,

  // tags: ['autodocs'],
  argTypes: {
    variant: {
      control: false,
    },
    iconType: {
      table: {
        disable: true,
      },
    },
    children: {
      control: { type: "object" },
    },
  },

  args: {
    children: <span>가입하기</span>,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const tertiary: Story = {
  args: {
    variant: "tertiary",
  },
};

export const onlyIcon: Story = {
  args: {
    variant: "onlyIcon",
    children: <Ic_close />,
  },
  argTypes: {
    iconType: {
      table: {
        disable: false,
      },
    },
  },
};
