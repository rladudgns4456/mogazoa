import React from "react";
import RankingItem from "@/components/ranking/RankingItem";
import RankingList from "@/components/ranking/RankingList";
import { CategoryList } from "@/components/Category";
import { ThumbsPanel } from "@/components/thumbs";

const categories = [
  { id: "computer", label: "전자기기", icon: "ic_computer" },
  { id: "noodle", label: "식당", icon: "ic_noodle" },
  { id: "box", label: "앱", icon: "ic_box" },
  { id: "music", label: "음악", icon: "ic_music" },
  { id: "hotel", label: "호텔", icon: "ic_hotel" },
  { id: "brush", label: "화장품", icon: "ic_brush" },
  { id: "movie", label: "영화/드라마", icon: "ic_movie" },
  { id: "book", label: "강의/책", icon: "ic_book" },
  { id: "furniture", label: "가구/인테리어", icon: "ic_furniture" },
  { id: "clothes", label: "의류/악세서리", icon: "ic_clothes" },
];

export default function TestPage() {
  return (
    <div className="grid grid-cols-3 gap-8 p-8">
      {/* Ranking */}
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

      {/* Category */}
      <div>
        <h2 className="mb-2 font-bold">Category</h2>
        <CategoryList layout="grid" columns={1} items={categories} onSelect={id => console.log("selected:", id)} />
      </div>

      {/* Thumbs */}
      <div>
        <h2 className="mb-2 font-bold">ThumbsPanel</h2>
        <ThumbsPanel
          items={[
            { id: "1", label: "도움이 돼요", count: 0, variant: "light" },
            { id: "2", label: "도움이 돼요", count: 0, variant: "dark" },
          ]}
        />
      </div>
    </div>
  );
}
