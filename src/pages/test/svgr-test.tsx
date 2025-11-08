import React from "react";
import IcMovie from "@/assets/ic_movie.svg";
import IcFood from "@/assets/ic_noodle.svg";

export default function SvgrTestPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-24-bold">SVGR 테스트</h1>

      {/* 1) 고정 사이즈 */}
      <div className="flex items-center gap-3">
        <span className="text-16-medium">24px:</span>
        <IcMovie width={24} height={24} />
        <IcFood width={24} height={24} />
      </div>

      {/* 2) Tailwind 색상/크기 상속 (SVG 내부가 currentColor여야 함) */}
      <div className="flex items-center gap-3 text-primary-600">
        <span className="text-16-medium">currentColor:</span>
        <IcMovie className="w-8 h-8" />
        <IcFood className="w-8 h-8" />
      </div>

      {/* 3) 회전/투명도 등 유틸 확인 */}
      <div className="flex items-center gap-3">
        <IcMovie className="w-10 h-10 rotate-12 opacity-70 text-gray-700" />
        <IcFood className="w-10 h-10 -rotate-12 text-black" />
      </div>
    </div>
  );
}
