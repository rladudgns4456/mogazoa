import React from "react";
import RankingItem from "./RankingItem";
import clsx from "clsx";

type Props = {
  ranks: Array<1 | 2 | 3 | 4>;
  label?: string;
  showFrame?: boolean;
  className?: string;
};

export default function RankingList({ ranks, label = "ranking", showFrame = false, className }: Props) {
  return (
    <div className={clsx("w-[96px]", className)}>
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
