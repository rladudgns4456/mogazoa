import React from "react";
import RankingItem from "./RankingItem";
import { cn } from "@/utils/cn";
import clsx from "clsx";

type Props = {
  ranks: Array<1 | 2 | 3 | 4>;
  label?: string;
  showFrame?: boolean;
  className?: string;
};

export default function RankingList({ ranks, label = "ranking", showFrame = false, className }: Props) {
  return (
    <div className={cn("w-96", className)}>
      <ol className="flex flex-col items-center gap-3">
        {ranks.map((rank, i) => (
          <li key={i}>
            <RankingItem rank={rank} />
          </li>
        ))}
      </ol>
    </div>
  );
}
