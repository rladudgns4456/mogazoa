import type { StorybookConfig } from "@storybook/nextjs-vite";
import svgr from "vite-plugin-svgr";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: { name: "@storybook/nextjs-vite", options: {} },
  staticDirs: ["../public"],
  async viteFinal(cfg) {
    cfg.plugins = [
      ...(cfg.plugins ?? []),
      svgr({
        include: "**/*.svg",
        svgrOptions: { icon: true },
      }),
    ];
    return cfg;
  },
};

export default config;
