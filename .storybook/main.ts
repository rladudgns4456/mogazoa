import type { StorybookConfig } from "@storybook/nextjs-vite";
import svgr from "vite-plugin-svgr";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@chromatic-com/storybook", "@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  
  staticDirs: ["../public"], 
   viteFinal: async (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(
      svgr({
        svgrOptions: {
          // SVGR 옵션 설정 (예: 컴포넌트로 사용할 때 icon 속성 추가)
          icon: true,
        },
        include: "**/*.svg", // SVG 파일만 포함하도록 설정
      })
    );
    return config;
  },
};
export default config;
