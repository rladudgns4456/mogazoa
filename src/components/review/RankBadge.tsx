import { getRankingIcon } from "@/assets/icons/ranking/icons";
import cn from "clsx";

interface RankBadgeProps {
  rank: 1 | 2 | 3;
  className?: string;
}

export default function RankBadge({ rank, className }: RankBadgeProps) {
  const DesktopIcon = getRankingIcon(`ic_rank_${rank}` as const);
  const MobileIcon = getRankingIcon(`ic_rank_m${rank}` as const);

  return (
    <div className={cn("absolute -left-10 -top-0 z-10", className)}>
      {/* 모바일 아이콘 (md 미만에서만 표시) */}
      <MobileIcon className={cn("h-full w-full", "md:hidden")} aria-hidden />

      {/* 데스크탑 아이콘 (md 이상에서만 표시) */}
      <DesktopIcon className={cn("hidden h-full w-full", "md:block")} aria-hidden />
    </div>
  );
}
