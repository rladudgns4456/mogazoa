import React from "react";
import { getRankingIcon } from "@/assets/icons/ranking/icons";

type Props = { rank: 1 | 2 | 3 | 4 };

export default function RankingItem({ rank }: Props) {
  const SvgIcon = getRankingIcon(`ic_rank_${rank}` as const);

  const boxW = 40; // px
  const boxH = rank === 1 ? 48 : 32; // px

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: boxW, height: boxH }}>
        {/* 박스를 꽉 채우도록 */}
        <SvgIcon className="absolute inset-0 block h-full w-full" aria-hidden />
      </div>
    </div>
  );
}
