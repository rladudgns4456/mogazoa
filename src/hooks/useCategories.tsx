import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, type CategoryApiResponse } from "@/api/categories";

import Ic_music from "@/assets/svgr/ic_music.svg?react";
import Ic_movies from "@/assets/svgr/ic_movies.svg?react";
import Ic_lecture from "@/assets/svgr/ic_lecture.svg?react";
import Ic_hotel from "@/assets/svgr/ic_hotel.svg?react";
import Ic_furniture from "@/assets/svgr/ic_furniture.svg?react";
import Ic_restaurant from "@/assets/svgr/ic_restaurant.svg?react";
import Ic_devices from "@/assets/svgr/ic_devices.svg?react";
import Ic_cosmetics from "@/assets/svgr/ic_cosmetics.svg?react";
import Ic_clothing from "@/assets/svgr/ic_clothing.svg?react";
import Ic_application from "@/assets/svgr/ic_application.svg?react";

const ICON_ARR = [
  { id: 1, icon: <Ic_music /> },
  { id: 2, icon: <Ic_movies /> },
  { id: 3, icon: <Ic_furniture /> },
  { id: 4, icon: <Ic_lecture /> },
  { id: 5, icon: <Ic_hotel /> },
  { id: 6, icon: <Ic_restaurant /> },
  { id: 7, icon: <Ic_devices /> },
  { id: 8, icon: <Ic_cosmetics /> },
  { id: 9, icon: <Ic_clothing /> },
  { id: 10, icon: <Ic_application /> },
];

export type CategoryType = {
  id: number;
  label: string;
  icon: React.ReactNode;
};

export function useCategories() {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<CategoryApiResponse[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories, // ✅ 함수 이름 맞추기
  });

  // get한 카테고리 값과 아이콘 합친 배열 만들기
  const combinedCategory: CategoryType[] = useMemo(() => {
    if (!response) return [];

    return response.map((item, index) => ({
      id: item.id,
      label: item.name,
      icon: ICON_ARR[index]?.icon ?? null, // ✅ 인덱스 안전하게
    }));
  }, [response]);

  return { combinedCategory, isLoading, isError };
}
