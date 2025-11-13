"use client";
import React from "react";
import RankingItem from "@/components/ranking/RankingItem";
import RankingList from "@/components/ranking/RankingList";
import { CategoryList } from "@/components/category";
import { ThumbsPanel } from "@/components/thumbs";
import CompareTable from "@/components/table/CompareTable";
import { Wifi } from "lucide-react";

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
    <div className="grid grid-cols-2 gap-8 p-8">
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
        <ThumbsPanel items={[{ id: "1", label: "도움이 돼요", count: 0, variant: "light" }]} />
      </div>

      {/* Compare Table */}
      <div>
        <h2 className="mb-2 font-bold">CompareTable</h2>
        <CompareTable
          size="L"
          typography={{
            // 별점(상단) 스타일
            top: "font-spoqa text-20 font-bold tabular-nums",
            // 왼쪽 라벨(이번 예시에선 비워두지만 규격 유지)
            label: "font-spoqa text-12 font-medium text-gray-600",
            // 행 값 = 별점과 동일
            value: "font-spoqa text-20 font-bold tabular-nums",
            // 우측 보조 pill
            side: "font-spoqa text-12 font-medium tabular-nums",
          }}
          top={{ a: <span>0.0</span>, b: <span>0.0</span> }}
          rows={[
            {
              // 1행: B가 더 큼 → B 하이라이트 + 트로피
              a: 111,
              b: 500,
              betterBy: "higher",
              format: v => `${v}개`,
            },
            {
              // 2행: 동점 처리(노란색/트로피 없음)
              a: 0,
              b: (
                <span className="inline-flex items-center gap-1">
                  0개 <Wifi className="size-3 opacity-70" />
                </span>
              ),
              betterBy: "higher",
              isBetter: () => "tie",
            },
            {
              // 3행: 동점
              a: 0,
              b: 0,
              betterBy: "higher",
              format: v => `${v}개`,
            },
          ]}
          // 필요하면 우측 보조 pill도 표시 가능
          // side={["4.9", "300개", "100개"]}
        />
      </div>
    </div>
  );
}
