// src/data/categoryIconMap.ts

// 백엔드 category.name 기준으로 icon 키 매핑 (필요에 따라 수정)
export const CATEGORY_ICON_MAP: Record<string, string> = {
  전자기기: "ic_computer",
  식당: "ic_noodle",
  앱: "ic_box",
  음악: "ic_music",
  호텔: "ic_hotel",
  화장품: "ic_brush",
  "영화/드라마": "ic_movie",
  "강의/책": "ic_book",
  "가구/인테리어": "ic_furniture",
};

export const DEFAULT_CATEGORY_ICON = "ic_box";
