import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SvgrTest from './svgr-test';

const meta = {
  component: SvgrTest,
} satisfies Meta<typeof SvgrTest>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};