// 필요한 아이콘 import
import ic_book from "./ic_book.svg";
import ic_box from "./ic_box.svg";
import ic_brush from "./ic_brush.svg";
import ic_clothes from "./ic_clothes.svg";
import ic_computer from "./ic_computer.svg";
import ic_furniture from "./ic_furniture.svg";
import ic_hotel from "./ic_hotel.svg";
import ic_movie from "./ic_movie.svg";
import ic_music from "./ic_music.svg";
import ic_noodle from "./ic_noodle.svg";

// 정적 맵 구성
export const categoryIcons = {
  ic_book,
  ic_box,
  ic_brush,
  ic_clothes,
  ic_computer,
  ic_furniture,
  ic_hotel,
  ic_movie,
  ic_music,
  ic_noodle,
} as const;

// 타입과 헬퍼 함수
export type CategoryIconKey = keyof typeof categoryIcons;
export const getCategoryIcon = (name: string) => categoryIcons[name as CategoryIconKey];
export const categoryIconKeys = Object.keys(categoryIcons) as CategoryIconKey[];
