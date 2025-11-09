import React from "react";
import RankingItem from "@/components/ranking/RankingItem";
import RankingList from "@/components/ranking/RankingList";
import { CategoryGrid } from "@/components/Category"; // ⬅️ 소문자 경로
import { ThumbsPanel } from "@/components/thumbs";

export default function TestPage() {
  return (
    <div className="grid grid-cols-3 gap-8 p-8">
      {/* 랭킹 */}
      <div>
        <h2 className="mb-2 font-bold">RankingItem</h2>
        <div className="flex gap-2">
          <RankingItem rank={1} />
          <RankingItem rank={2} />
          <RankingItem rank={3} />
          <RankingItem rank={4} />
        </div>

        <h2 className="mb-2 mt-6 font-bold">RankingList</h2>
        <RankingList ranks={[1, 2, 3, 4]} showFrame />
      </div>

      {/* 카테고리 */}
      <div>
        <h2 className="mb-2 font-bold">CategoryGrid</h2>
        <CategoryGrid
          columns={2}
          items={[
            { id: "computer", label: "전자기기", icon: "ic_computer" },
            { id: "noodle", label: "식당", icon: "ic_noodle" },
            { id: "movie", label: "영화", icon: "ic_movie" },
            { id: "music", label: "음악", icon: "ic_music" },
          ]}
        />
      </div>

      {/* 👍 Thumbs */}
      <div>
        <h2 className="mb-2 font-bold">ThumbsPanel</h2>
        <ThumbsPanel
          items={[
            { id: "1", label: "도움이 돼요", count: 0 },
            { id: "2", label: "도움이 돼요", count: 12, active: true },
            { id: "3", label: "도움이 돼요", count: 5 },
          ]}
        />
      </div>
    </div>
  );
}
