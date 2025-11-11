import ProductSearchInput from "@/components/input/ProductSearchInput";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

const meta: Meta<typeof ProductSearchInput> = {
  title: "Components/ProductSearchInput",
  component: ProductSearchInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    value: { control: "text" },
    productList: { control: "object" },
  },
  args: {
    placeholder: "검색어를 입력해주세요",
    value: "",
    onChange: fn(),
    onSelect: fn(),
    productList: [
      "GL. Buffet pendant lighting",
      "GL. Buffet chandelier",
      "GL. Modern pendant light",
      "GL. Vintage buffet lamp",
      "GL. Crystal pendant",
      "Buffet side pendant lighting",
      "Modern GL buffet fixture",
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
