import type { StoryObj, Meta } from "@storybook/react";
import Statistics, { StatisticsProps } from "@/components/statistics";

const meta: Meta<typeof Statistics> = {
  title: "Components/Statistics",
  component: Statistics,
};
export default meta;

type Story = StoryObj<StatisticsProps>;

export const Default: Story = {
  args: {
    rating: 4.3,
    reviewCount: 1234,
    favoriteCount: 320,
    categoryMetric: {
      rating: 3.8,
      reviewCount: 900,
      favoriteCount: 400,
    },
  },
};

export const NoData: Story = {
  args: {
    rating: undefined,
    reviewCount: undefined,
    favoriteCount: undefined,
    categoryMetric: undefined,
  },
};
