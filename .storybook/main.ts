import type { StorybookConfig } from "@storybook/nextjs-vite";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@chromatic-com/storybook", "@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],

  viteFinal: async viteConfig => {
    viteConfig.plugins = [
      ...(viteConfig.plugins || []),
      svgr({
        svgrOptions: {
          icon: true,
          // SVGO v3 방식: preset-default에서 removeViewBox만 끄기
          svgoConfig: {
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
            ],
          },
        },
        include: "**/*.svg",
      }),
    ];

    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias || {}),
      "@": resolve(__dirname, "../src"),
    };

    return viteConfig;
  },
};

export default config;
