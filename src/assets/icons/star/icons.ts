import ic_star_empty from "./ic_star_empty.svg?react";
import ic_star_fill from "./ic_star_fill.svg?react";
import ic_star_y from "./ic_star_y.svg?react";

export const starIcons = {
  ic_star_empty,
  ic_star_fill,
  ic_star_y,
} as const;

export type StarIconKey = keyof typeof starIcons;
export const getStarIcon = (key: StarIconKey) => starIcons[key];
