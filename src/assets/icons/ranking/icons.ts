import ic_rank_1 from "./ic_rank_1.svg?react";
import ic_rank_2 from "./ic_rank_2.svg?react";
import ic_rank_3 from "./ic_rank_3.svg?react";
import ic_rank_m1 from "./ic_rank_m1.svg?react";
import ic_rank_m2 from "./ic_rank_m2.svg?react";
import ic_rank_m3 from "./ic_rank_m3.svg?react";

export const rankingIcons = {
  ic_rank_1,
  ic_rank_2,
  ic_rank_3,
  ic_rank_m1,
  ic_rank_m2,
  ic_rank_m3,
} as const;

export type RankingIconKey = keyof typeof rankingIcons;
export const getRankingIcon = (key: RankingIconKey) => rankingIcons[key];
