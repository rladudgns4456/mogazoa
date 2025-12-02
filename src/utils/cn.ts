// utils/cn.ts
import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

export const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        /*12px*/
        "text-12-light",
        "text-12-regular",
        "text-12-medium",
        "text-12-bold",

        /*14px*/
        "text-14-light",
        "text-14-regular",
        "text-14-medium",
        "text-14-bold",

        /*16px*/
        "text-16-light",
        "text-16-regular",
        "text-16-medium",
        "text-16-bold",

        /*18px*/
        "text-18-light",
        "text-18-regular",
        "text-18-medium",
        "text-18-bold",

        /*20px*/
        "text-20-regular",
        "text-20-bold",

        /*24px*/
        "text-24-regular",
        "text-24-bold",

        /*28px*/
        "text-28-regular",
        "text-28-bold",

        /*32px*/
        "text-32-regular",
        "text-32-bold",

        /*40px*/
        "text-40-bold",
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => {
  return customTwMerge(clsx(...inputs));
};
